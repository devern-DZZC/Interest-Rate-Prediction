from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password = db.Column(db.String(120), nullable=False)
  #client = db.relationship('UserClient', backref='user')

  def __init__(self, username, password):
    self.username = username
    self.set_password(password)

  def set_password(self, password):
      """Create hashed password."""
      self.password = generate_password_hash(password)
  
  def check_password(self, password):
      """Check hashed password."""
      return check_password_hash(self.password, password)