from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import now
from werkzeug.security import generate_password_hash, check_password_hash
import enum, pandas as pd

db = SQLAlchemy()

class accessLevel(enum.Enum):
    caller = 1
    admin = 2
    root = 3

class term(enum.Enum):
    FALL = 1
    SPRING = 2
    SUMMER = 3

class ValidUser(db.Model):
    __tablename__ = 'valid_user_set'

    id=db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    username=db.Column(db.String(40), unique=True)
    hashedPassword=db.Column(db.Text, nullable=False)
    email=db.Column(db.String(300), unique=True, nullable=False)
    accessLevel=db.Column(db.Enum(accessLevel))
    activationStatus=db.Column(db.Boolean)

    def __init__(self, name, username, password, email, accessLevel, activationStatus):
        self.name = name
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
    name = db.Column(db.Text)
    username = db.Column(db.String(40), unique = True)
    hashedPassword=db.Column(db.Text, nullable = False)
    email = db.Column(db.String(300), unique = True, nullable = False)
    accessLevel = db.Column(db.Enum(accessLevel))
    time_created = db.Column(db.DateTime(timezone=True), server_default=now())

    def __init__(self, username, password, email, accessLevel):
        self.name = "John Doe (temp)"
        self.username = username
        self.hashedPassword = generate_password_hash(password)
        self.email = email
        self.accessLevel = accessLevel

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''

#Prospect Information

class ProspectList(db.Model):
    __tablename__ = 'prospect_list'
    id = db.Column(db.Integer, primary_key = True)
    tNumber = db.Column(db.String(9), unique = True)
    campaignStatus = db.Column(db.Boolean)
    numCampaigns = db.Column(db.Integer)

    def __init__(self, tNumber)
        self.tNumber = tNumber
        self.campaignStatus = True
        self.numCampaigns = 0

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''


class ProspectImportData(db.Model):
    __tablename__ = 'prospect_import_data'
    id = db.Column(db.Integer, primary_key = True)
    tNumber = db.Column(db.String(9), ForeignKey('ProspectList.tNumber'))
    #First, Middle, Last Names
    name1 = db.Column(db.String(30), nullable=False)
    name2 = db.Column(db.String(30))
    name3 = db.Column(db.String(30), nullable=False)
    term = db.Column(db.Enum(term))
    #Might make enum for level
    level = db.Column(db.String(30))
    program = db.Column(db.String(30), nullable=False)
    college = db.Column(db.String(30), nullable=False)
    department = db.Column(db.String(30))
    admitDate = db.Column(db.DateTime(timezone=True))
    address1 = db.Column(db.String(100), nullable=False)
    address2 = db.Column(db.String(100))
    address3 = db.Column(db.String(100))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(20), nullable=False)
    zip = db.Column(db.String(10), nullable=False)
    areaCode = db.Column(db.Integer), nullable=False)
    phone = db.Column(db.Integer), nullable=False)
    phoneExt = db.Column(db.Integer))
    email = db.Column(db.String(100), nullable=False)
    emailSchool = db.Column(db.String(100), nullable=False)
    #Might make studentType an enum
    studentType = db.Column(db.String(30))

    #Requires temp as pandas dataframe
    def __init__(self, temp, tNumber):
        self.tNumber=tNumber
        self.name1 = temp[0]
        self.name2 = temp[1]
        self.name3 = temp[2]
        self.term = temp[3]
        self.level = temp[4]
        self.program = temp[5]
        self.college = temp[6]
        self.department = temp[7]
        self.admitDate = temp[8]
        self.address1 = temp[9]
        self.address2 = temp[10]
        self.address3 = temp[11]
        self.city = temp[12]
        self.state = temp[13]
        self.zip = temp[14]
        self.areaCode = temp[15]
        self.phone = temp[16]
        self.phoneExt = temp[17]
        self.email = temp[18]
        self.emailSchool = temp[19]
        self.studentType = temp[20]

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''



