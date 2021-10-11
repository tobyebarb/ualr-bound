from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import enum

db = SQLAlchemy()

class accessLevel(enum.Enum):
    caller = 1
    admin = 2
    root = 3

class ValidUser(db.Model):
    __tablename__ = 'valid_user_set'

    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(40), unique=True)
    hashedPassword=db.Column(db.Text, nullable=False)
    email=db.Column(db.String(300), unique=True, nullable=False)
    accessLevel=db.Column(db.Enum(accessLevel))
    activationStatus=db.Column(db.Boolean)

    def __init__(self, username, password, email, accessLevel, activationStatus):
        self.username = username
        self.hashedPassword = password #Due to importing password hash itself
        self.email = email
        self.accessLevel = accessLevel
        self.activationStatus = activationStatus

    def __repr__(self):
        return f'<User {self.username}>'

    def verify_password(self, pwd):
        return check_password_hash(self.hashedPassword, pwd)

    def getId(self):
        return f''


class RegistrationRequest(db.Model):
    __tablename__ = 'registration_request'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(40), unique = True)
    hashedPassword=db.Column(db.Text, nullable = False)
    email = db.Column(db.String(300), unique = True, nullable = False)
    accessLevel = db.Column(db.Enum(accessLevel))

    def __init__(self, username, password, email, accessLevel):
        self.username = username
        self.hashedPassword = generate_password_hash(password)
        self.email = email
        self.accessLevel = accessLevel

    def __repr__(self):
        return f'<Request {self.username}>'

    def getId(self):
        return f''
