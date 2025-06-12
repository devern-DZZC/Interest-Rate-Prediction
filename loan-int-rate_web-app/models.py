from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password = db.Column(db.String(120), nullable=False)
  clients = db.relationship('Client', backref='user', lazy=True)

  def __init__(self, username, password):
    self.username = username
    self.set_password(password)

  def set_password(self, password):
      """Create hashed password."""
      self.password = generate_password_hash(password)
  
  def check_password(self, password):
      """Check hashed password."""
      return check_password_hash(self.password, password)
  
class Client(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   name = db.Column(db.String(120), nullable=False)
   creditPolicy = db.Column(db.Integer, nullable=False)
   purpose = db.Column(db.String(120), nullable=False)
   logAnnInc = db.Column(db.Float, nullable=False)
   dti = db.Column(db.Float, nullable=False)
   fico = db.Column(db.Integer, nullable=False)
   daysWithCrLine = db.Column(db.Float, nullable=False)
   revolUtil = db.Column(db.Float, nullable=False)
   inqLast6Mon = db.Column(db.Integer, nullable=False)
   delinq2Years = db.Column(db.Integer, nullable=False)
   pubRec = db.Column(db.Integer, nullable=False)
   notFullyPaid = db.Column(db.Integer, nullable=False)

   user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

   def __init__(self, name, creditPolicy, purpose, logAnnInc, dti, fico, daysWithCrLine,
             revolUtil, inqLast6Mon, delinq2Years, pubRec, notFullyPaid, user_id):
    self.name = name
    self.creditPolicy = creditPolicy
    self.purpose = purpose
    self.logAnnInc = logAnnInc
    self.dti = dti
    self.fico = fico
    self.daysWithCrLine = daysWithCrLine
    self.revolUtil = revolUtil
    self.inqLast6Mon = inqLast6Mon
    self.delinq2Years = delinq2Years
    self.pubRec = pubRec
    self.notFullyPaid = notFullyPaid
    self.user_id = user_id
