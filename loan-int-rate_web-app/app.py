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

from models import db, User

print('Loading...')
model = joblib.load('model/prediction.pkl')
transformer = joblib.load('model/transformer.pkl') 
print('Loaded!')

# Configure Flask App
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'MySecretKey'
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token'
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=15)
app.config["JWT_COOKIE_SECURE"] = True
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config['JWT_HEADER_NAME'] = "Cookie"


# Initialize App 
db.init_app(app)
app.app_context().push()
CORS(app)
jwt = JWTManager(app)

# JWT Config to enable current_user
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

clients = []

def initialize_db():
  db.drop_all()
  db.create_all()
  user = User(username='bob', password='bobpass')
  db.session.add(user)
  db.session.commit()

@app.route("/", methods=['GET'])
def login_page():
  return render_template("login.html")

@app.route("/signup", methods=['POST'])
def signup_action():
  response = None
  try:
    username = request.form['username']
    password = request.form['password']
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    response = redirect(url_for('home_page'))
    token = create_access_token(identity=str(user.id))
    set_access_cookies(response, token)
  except IntegrityError:
    flash('Username already exists')
    response = redirect(url_for('signup_page'))
  flash('Account created')
  return response

@app.route("/logout", methods=['GET'])
@jwt_required()
def logout_action():
  response = redirect(url_for('login_page'))
  unset_jwt_cookies(response)
  flash('Logged out')
  return response

# *************************************

# Page Routes (To Update)

@app.route("/app", methods=['GET'])
@jwt_required()
def home_page():
    return render_template(
        "index.html", 
        current_user=current_user,
        clients=clients 
    )


@app.route("/login", methods=['POST'])
def login_action():
  # implement login
  data = request.form
  token = login_user(data['username'], data['password'])
  response = None
  print(token)
  if token:
    flash('Logged in successfully!')
    response = redirect(url_for('home_page'))
    set_access_cookies(response, token)
  else:
    flash('Incorrect username or password.')
    response = redirect(url_for('login_page'))
  return response

@app.route("/predict", methods=['POST'])
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

        clients.append({
            "name": data["name"],
            "creditPolicy": 'Yes' if data["creditPolicy"]==0 else 'No',
            "purpose": data["purpose"],
            "dti": data["dti"],
            "fico": data["fico"],
            "logAnnInc": data["logAnnInc"],
            "daysWithCrLine": data["daysWithCrLine"],
            "revolUtil": data["revolUtil"],
            "inqLast6Mon": data["inqLast6Mon"],
            "delinq2Years": data["delinq2Years"],
            "pubRec": data["pubRec"],
            "notFullyPaid": 'Yes' if data["notFullyPaid"]=='1' else 'No',
            "interestRate": prediction
        })

        return redirect(url_for("home_page"))

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Invalid input or prediction failed"}), 400




""""
print('Loading...')

model = joblib.load('model/prediction.pkl')
transformer = joblib.load('model/transformer.pkl') 
print('Loaded!')


sample_data = {
    'credit.policy': [1],
    'purpose': ["debt_consolidation"],
    'log.annual.inc': [11.350407],
    'dti': [19.48],
    'fico': [400],
    'days.with.cr.line': [5639.95833],
    'revol.util': [52.1],
    'inq.last.6mths': [1],
    'delinq.2yrs': [0],
    'pub.rec': [0],
    'not.fully.paid': [0] 
}


input_df = pd.DataFrame(sample_data)


transformed_X = transformer.transform(input_df)


pred = model.predict(transformed_X)


print("Prediction:", pred)

"""

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)
