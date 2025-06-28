import os, csv
import datetime
from flask import Flask, request, redirect, render_template, url_for, flash, jsonify
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
    current_user
)
import joblib
import pandas as pd

from models import db, User, Client

print('Loading Model...')
model = joblib.load('model/prediction.pkl')
transformer = joblib.load('model/transformer.pkl') 
print('Model Loaded!')

# Configure Flask App
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///' + os.path.join(app.root_path, 'data.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback_secret_key')
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token'
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=15)
app.config["JWT_COOKIE_SECURE"] = True
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'fallback_jwt_secret')
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config['JWT_HEADER_NAME'] = "Cookie"


# Initialize App 
db.init_app(app)
app.app_context().push()
CORS(app)
jwt = JWTManager(app)


@jwt.user_identity_loader
def user_identity_lookup(identity):
  return identity

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
  identity = jwt_data["sub"]
  return User.query.get(str(identity))

def login_user(username, password):
  user = User.query.filter_by(username=username).first()
  if user and user.check_password(password):
    token = create_access_token(identity=str(user.id))
    return token
  return None


def initialize_db():
  db.drop_all()
  db.create_all()
  user = User(username='bob', password='bobpass')
  db.session.add(user)
  db.session.commit()

@app.route('/init', methods=['GET'])
def init():
    initialize_db()
    return redirect('/')

@app.route("/signup", methods=['POST'])
def signup_action():
  response = None
  try:
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    response = jsonify({"message": "Account created successfully"})
    token = create_access_token(identity=str(user.id))
    set_access_cookies(response, token)
    return response, 200
  except IntegrityError:
    flash('Username already exists')
    response = jsonify({"error": "Failed to create account"})
    return response, 401

@app.route("/logout", methods=['GET'])
@jwt_required()
def logout_action():
  response = jsonify({"msg": "Logged out"})
  unset_jwt_cookies(response)
  flash('Logged out')
  return response, 200


@app.route("/login", methods=['POST'])
def login_action():
  data = request.get_json()
  username = data.get('username')
  password = data.get('password')
  token = login_user(username, password)
  response = None
  if token:
    flash('Logged in successfully!')
    response = jsonify({"message": "Login successful"})
    set_access_cookies(response, token)
    return response, 200
  else:
    flash('Incorrect username or password.')
    response = jsonify({"error": "Invalid credentials"})
  return response, 401

@app.route("/predict", methods=['POST'])
@jwt_required()
def predict_action():
    try:
        data = request.form
        input_data = {
            'credit.policy': [int(data['creditPolicy'])],
            'purpose': [data['purpose']],
            'log.annual.inc': [float(data['logAnnInc'])],
            'dti': [float(data['dti'])],
            'fico': [int(data['fico'])],
            'days.with.cr.line': [float(data['daysWithCrLine'])],
            'revol.util': [float(data['revolUtil'])],
            'inq.last.6mths': [int(data['inqLast6Mon'])],
            'delinq.2yrs': [int(data['delinq2Years'])],
            'pub.rec': [int(data['pubRec'])],
            'not.fully.paid': [int(data['notFullyPaid'])] 
        }

        input_df = pd.DataFrame(input_data)
        transformed_X = transformer.transform(input_df)
        pred = model.predict(transformed_X)
        prediction = round(float(pred[0]) * 100, 1)

        client = Client(
            name=str(data["name"]),
            creditPolicy=int(data["creditPolicy"]),  
            purpose=str(data["purpose"]),
            dti=float(data["dti"]),
            fico=int(data["fico"]),
            logAnnInc=float(data["logAnnInc"]),
            daysWithCrLine=float(data["daysWithCrLine"]),
            revolUtil=float(data["revolUtil"]),
            inqLast6Mon=int(data["inqLast6Mon"]),
            delinq2Years=int(data["delinq2Years"]),
            pubRec=int(data["pubRec"]),
            notFullyPaid=int(data["notFullyPaid"]),  
            user_id=current_user.id,
            intRate=float(prediction)
        )
        db.session.add(client)
        db.session.commit()

        return jsonify({"message": "Client added successfully"}), 200

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Invalid input or prediction failed"}), 400

@app.route("/delete/<int:client_id>", methods=["GET"])
@jwt_required()
def delete_action(client_id):
    res = current_user.delete_client(client_id)
    if res == None:
      return jsonify({"message": "Client failed to be deleted"}), 403
    else:
      return jsonify({"message": "Client deleted successfully"}), 200

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)
