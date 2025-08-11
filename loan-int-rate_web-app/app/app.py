import os
import io
import datetime
from flask import Flask, request, redirect, jsonify, send_file
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
import shap
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # use non-interactive backend for server
import matplotlib.pyplot as plt

from models import db, User, Client

# ----------------------
# Startup / model load
# ----------------------
print('Loading Model...')
model = joblib.load('model/prediction.pkl')
transformer = joblib.load('model/transformer.pkl')
print('Model Loaded!')

# Use underlying estimator if RandomizedSearchCV / GridSearchCV was used
estimator_for_explainer = model.best_estimator_ if hasattr(model, 'best_estimator_') else model
explainer = shap.Explainer(estimator_for_explainer)

# Hard-coded feature names for transformed data (adjust if your transformer order differs)
# 7 one-hot purpose columns + numeric features
all_features = [
    'purpose_all_other',
    'purpose_credit_card',
    'purpose_debt_consolidation',
    'purpose_educational',
    'purpose_home_improvement',
    'purpose_major_purchase',
    'purpose_small_business',
    'credit.policy',
    'log.annual.inc',
    'dti',
    'fico',
    'days.with.cr.line',
    'revol.util',
    'inq.last.6mths',
    'delinq.2yrs',
    'pub.rec',
    'not.fully.paid'
]

# Try to load a CSV of transformed (or raw) training data for summary/dependence plots.
# If you prefer to save the transformed training data csv, point full_dataset_path to that file.
full_dataset_path = os.path.join('model', 'trans_training_data.csv')  # prefer transformed X saved earlier
full_data_raw = None
full_data_transformed = None

try:
    # If you have raw training CSV and need transformer applied, adjust accordingly.
    full_data_transformed = pd.read_csv(full_dataset_path)
    # If it is a DataFrame of transformed features already, ensure shape matches all_features
    if list(full_data_transformed.shape)[1] == len(all_features):
        # ok, full_data_transformed is a numeric DataFrame of transformed features
        pass
    else:
        # try loading raw and transforming (fallback)
        full_data_raw = pd.read_csv(os.path.join('model', 'training_data.csv'))
        full_data_transformed = transformer.transform(full_data_raw)
        # if sparse convert to array
        if hasattr(full_data_transformed, 'toarray'):
            full_data_transformed = full_data_transformed.toarray()
except Exception as e:
    # warn but continue — per-client SHAP will still work
    print(f"Warning: Could not load full dataset for SHAP plots: {e}")
    full_data_raw = None
    full_data_transformed = None

# ----------------------
# Flask app config
# ----------------------
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    'sqlite:///' + os.path.join(app.root_path, 'data.db')
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback_secret_key')
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token'
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=15)
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'fallback_jwt_secret')
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config['JWT_HEADER_NAME'] = "Cookie"

db.init_app(app)
app.app_context().push()

CORS(app, supports_credentials=True, origins=[
    "http://localhost:5174",
    "http://localhost:5173",
    "https://loan-advisor.azurewebsites.net"
])

jwt = JWTManager(app)

# ----------------------
# Helpers
# ----------------------
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

def build_input_dict_from_data(data):
    """
    Build input dictionary expected by the transformer / model.
    Accepts incoming keys like creditPolicy or credit.policy etc.
    """
    return {
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

def predict_and_save_client(data, user_id):
    """
    Predict for a single client, save to DB, and return SHAP values and prediction.
    """
    try:
        input_data = build_input_dict_from_data(data)
        input_df = pd.DataFrame(input_data)
        transformed_X = transformer.transform(input_df)
        # convert sparse to dense if needed
        if hasattr(transformed_X, 'toarray'):
            transformed_X = transformed_X.toarray()

        pred = model.predict(transformed_X)
        prediction = round(float(pred[0]) * 100, 1)

        # Explainer returns an object; call it on transformed_X
        shap_obj = explainer(transformed_X)
        # shap_obj may have .values property
        shap_values_list = shap_obj.values[0].tolist() if hasattr(shap_obj, 'values') else shap_obj.tolist()

        client = Client(
            name=str(data.get("name", "")),
            creditPolicy=int(data['creditPolicy']),
            purpose=str(data.get("purpose", "")),
            dti=float(data['dti']),
            fico=int(data['fico']),
            logAnnInc=float(data['logAnnInc']),
            daysWithCrLine=float(data['daysWithCrLine']),
            revolUtil=float(data['revolUtil']),
            inqLast6Mon=int(data['inqLast6Mon']),
            delinq2Years=int(data['delinq2Years']),
            pubRec=int(data['pubRec']),
            notFullyPaid=int(data['notFullyPaid']),
            user_id=user_id,
            intRate=float(prediction)
        )
        db.session.add(client)
        db.session.commit()

        return {
            "success": True,
            "prediction": prediction,
            "name": data.get("name", ""),
            "shap_values": shap_values_list,
            "feature_names": all_features  # simplified: return transformed feature list
        }
    except Exception as e:
        print("Error processing client:", e)
        db.session.rollback()
        return {"success": False, "error": str(e), "name": data.get("name", "")}

# ----------------------
# Routes: auth, predict, clients, upload, delete
# ----------------------
@app.route('/init', methods=['GET'])
def init():
    initialize_db()
    return redirect('/')

@app.route("/signup", methods=['POST'])
def signup_action():
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
        response = jsonify({"error": "Failed to create account"})
        return response, 401

@app.route("/logout", methods=['GET'])
@jwt_required()
def logout_action():
    response = jsonify({"msg": "Logged out"})
    unset_jwt_cookies(response)
    return response, 200

@app.route("/login", methods=['POST'])
def login_action():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    token = login_user(username, password)
    if token:
        response = jsonify({"message": "Login successful"})
        set_access_cookies(response, token)
        return response, 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/predict", methods=['POST'])
@jwt_required()
def predict_action():
    try:
        data = request.get_json()
        result = predict_and_save_client(data, current_user.id)
        if result.get("success"):
            return jsonify({"message": "Client added successfully", "prediction": result["prediction"]}), 200
        return jsonify({"error": result.get("error", "Prediction failed")}), 400
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Invalid input or prediction failed"}), 400

@app.route("/clients", methods=["GET"])
@jwt_required()
def get_clients():
    user_clients = Client.query.filter_by(user_id=current_user.id).all()
    clients_list = [{
            "id": client.id,
            "name": client.name,
            "creditPolicy": client.creditPolicy,
            "purpose": client.purpose,
            "dti": client.dti,
            "fico": client.fico,
            "logAnnInc": client.logAnnInc,
            "daysWithCrLine": client.daysWithCrLine,
            "revolUtil": client.revolUtil,
            "inqLast6Mon": client.inqLast6Mon,
            "delinq2Years": client.delinq2Years,
            "pubRec": client.pubRec,
            "notFullyPaid": client.notFullyPaid,
            "intRate": client.intRate
        } for client in user_clients]
    return jsonify(clients_list), 200

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.csv'):
        return jsonify({"error": "File must be a CSV"}), 400

    try:
        df = pd.read_csv(file)
        results = []
        for _, row in df.iterrows():
            # normalize column names and accept both dotted and plain names
            data = {
                "name": row.get("full.name") or row.get("Name") or row.get("name") or "",
                "creditPolicy": row.get("creditPolicy") or row.get("credit.policy"),
                "purpose": row.get("purpose"),
                "logAnnInc": row.get("logAnnInc") or row.get("log.annual.inc"),
                "dti": row.get("dti"),
                "fico": row.get("fico"),
                "daysWithCrLine": row.get("daysWithCrLine") or row.get("days.with.cr.line"),
                "revolUtil": row.get("revolUtil") or row.get("revol.util"),
                "inqLast6Mon": row.get("inqLast6Mon") or row.get("inq.last.6mths"),
                "delinq2Years": row.get("delinq2Years") or row.get("delinq.2yrs"),
                "pubRec": row.get("pubRec") or row.get("pub.rec"),
                "notFullyPaid": row.get("notFullyPaid") or row.get("not.fully.paid"),
            }
            res = predict_and_save_client(data, current_user.id)
            results.append(res)
        return jsonify({"message": "CSV processed", "results": results}), 200
    except Exception as e:
        print("CSV upload error:", e)
        return jsonify({"error": "Failed to process CSV file", "detail": str(e)}), 500

@app.route("/clients/<int:client_id>", methods=["GET"])
@jwt_required()
def get_client_by_id(client_id):
    client = Client.query.filter_by(id=client_id, user_id=current_user.id).first()
    if not client:
        return jsonify({"error": "Client not found"}), 404

    # prepare input for SHAP and prediction-explanation
    input_data = {
        'credit.policy': [client.creditPolicy],
        'purpose': [client.purpose],
        'log.annual.inc': [client.logAnnInc],
        'dti': [client.dti],
        'fico': [client.fico],
        'days.with.cr.line': [client.daysWithCrLine],
        'revol.util': [client.revolUtil],
        'inq.last.6mths': [client.inqLast6Mon],
        'delinq.2yrs': [client.delinq2Years],
        'pub.rec': [client.pubRec],
        'not.fully.paid': [client.notFullyPaid]
    }
    input_df = pd.DataFrame(input_data)
    transformed_X = transformer.transform(input_df)
    if hasattr(transformed_X, 'toarray'):
        transformed_X = transformed_X.toarray()

    shap_obj = explainer(transformed_X)
    shap_values_list = shap_obj.values[0].tolist() if hasattr(shap_obj, 'values') else shap_obj.tolist()

    client_dict = {
        "id": client.id,
        "name": client.name,
        "creditPolicy": client.creditPolicy,
        "purpose": client.purpose,
        "dti": client.dti,
        "fico": client.fico,
        "logAnnInc": client.logAnnInc,
        "daysWithCrLine": client.daysWithCrLine,
        "revolUtil": client.revolUtil,
        "inqLast6Mon": client.inqLast6Mon,
        "delinq2Years": client.delinq2Years,
        "pubRec": client.pubRec,
        "notFullyPaid": client.notFullyPaid,
        "intRate": client.intRate,
        "shap_values": shap_values_list,
        "feature_names": all_features
    }
    return jsonify(client_dict), 200

@app.route("/delete/<int:client_id>", methods=["DELETE"])
@jwt_required()
def delete_action(client_id):
    res = current_user.delete_client(client_id)
    if res is None:
        return jsonify({"message": "Client failed to be deleted"}), 403
    return jsonify({"message": "Client deleted successfully"}), 200


@app.route('/shap/force_plot/<int:client_id>')
@jwt_required()
def shap_force_plot(client_id):
    """
    Returns HTML snippet (JS + HTML) for SHAP force plot for a single client.
    Frontend should embed this HTML snippet (dangerouslySetInnerHTML).
    """
    client = Client.query.filter_by(id=client_id, user_id=current_user.id).first()
    if not client:
        return jsonify({"error": "Client not found"}), 404

    try:
        input_data = {
            'credit.policy': [client.creditPolicy],
            'purpose': [client.purpose],
            'log.annual.inc': [client.logAnnInc],
            'dti': [client.dti],
            'fico': [client.fico],
            'days.with.cr.line': [client.daysWithCrLine],
            'revol.util': [client.revolUtil],
            'inq.last.6mths': [client.inqLast6Mon],
            'delinq.2yrs': [client.delinq2Years],
            'pub.rec': [client.pubRec],
            'not.fully.paid': [client.notFullyPaid]
        }
        input_df = pd.DataFrame(input_data)
        transformed_X = transformer.transform(input_df)
        if hasattr(transformed_X, 'toarray'):
            transformed_X = transformed_X.toarray()

        shap_obj = explainer(transformed_X)
        force_plot = shap.plots.force(shap_obj[0], matplotlib=False, show=False)
        # shap.force returns a JS/HTML wrapped object; .data contains the HTML/JS snippet
        return force_plot.data
    except Exception as e:
        print("Error generating force plot:", e)
        return jsonify({"error": f"Failed to generate force plot: {e}"}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
