from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import now
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
    name = db.Column(db.Text)
    username=db.Column(db.String(40), unique=True)
    hashedPassword=db.Column(db.Text, nullable=False)
    email=db.Column(db.String(300), unique=True, nullable=False)
    accessLevel=db.Column(db.Enum(accessLevel))
    activationStatus=db.Column(db.Boolean)
    time_created = db.Column(db.DateTime(timezone=True), server_default=now())

    def __init__(self, name, username, password, email, accessLevel, activationStatus):
        self.name = name
        self.username = username
        self.hashedPassword = password #Due to importing password hash itself
        self.email = email
        self.accessLevel = accessLevel
        self.activationStatus = activationStatus

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

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

    def __init__(self, name, username, password, email, accessLevel):
        self.name = name
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
    ethnicity = db.Column(db.String(30))
    sex = db.Column(db.String(10))
    #Might make studentType an enum
    studentType = db.Column(db.String(30))

    #Requires temp as pandas dataframe
    def __init__(self, temp, tNumber):
        self.tNumber=tNumber
        self.name1 = temp.c2
        self.name2 = temp.c3
        self.name3 = temp.c4
        tempTerm = temp.c5.split()
        self.term = tempTerm[1]
        self.level = temp.c6
        self.program = temp.c7
        self.college = temp.c8
        self.department = temp.c9
        self.admitDate = temp.c10
        self.address1 = temp.c11
        self.address2 = temp.c12
        self.address3 = temp.c13
        self.city = temp.c14
        self.state = temp.c15
        self.zip = temp.c16
        self.areaCode = temp.c17
        self.phone = temp.c18
        self.phoneExt = temp.c19
        self.email = temp.c20
        self.emailSchool = temp.c21
        self.ethnicity = temp.c22
        self.sex = temp.c23
        self.studentType = temp.c24

    def updateInformation(self, temp):
        self.name1 = temp.c2
        self.name2 = temp.c3
        self.name3 = temp.c4
        tempTerm = temp.c5.split()
        self.term = tempTerm[1]
        self.level = temp.c6
        self.program = temp.c7
        self.college = temp.c8
        self.department = temp.c9
        self.admitDate = temp.c10
        self.address1 = temp.c11
        self.address2 = temp.c12
        self.address3 = temp.c13
        self.city = temp.c14
        self.state = temp.c15
        self.zip = temp.c16
        self.areaCode = temp.c17
        self.phone = temp.c18
        self.phoneExt = temp.c19
        self.email = temp.c20
        self.emailSchool = temp.c21
        self.ethnicity = temp.c22
        self.sex = temp.c23
        self.studentType = temp.c24

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''

#Only saves one campaign.  Must be passed year and term on initialization.
#May need to add that information for current campaign to caller table.

class ProspectSRA(db.Model):
    __tablename__ = 'prospect_sra'
    id = db.Column(db.Integer, primary_key=True
    tNumber = db.Column(db.String(9), ForeignKey('ProspectList.tNumber'))
    term = db.Column(db.Enum(term))
    year = db.Column(db.Integer, nullable=False)
    #Previous caller and date of call
    wasCalled = db.Column(db.Boolean)
    prevCaller = db.Column(db.String(100))
    dateCalled = db.Column(db.DateTime(timezone=True))
    numTimesCalled = db.Column(db.Integer, nullable=False)
    #Information about previous call
    callResponse = db.Column(db.Enum(response))
    callNotes = db.Column(db.String(500))
    #Information about email
    wasEmailed = db.Column(db.Boolean)
    dateEmailed = db.Column(db.DateTime(timezone=True))
    emailText = db.Column(db.String(500))

    def __init__(self,tNumber,term,year):
        self.tNumber = tNumber
        self.term = term
        self.year = year
        self.wasCalled = False
        self.numTimesCalled = 0
        self.wasEmailed = False

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''

