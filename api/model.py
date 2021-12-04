from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import now
from werkzeug.security import generate_password_hash, check_password_hash
import enum, pandas as pd

db = SQLAlchemy()

def formatEntry(entry):
    integerColumns = [
        'Phone Area code',
        'Phone Number',
        'Phone Extension',
        ]

    """
    Columns is a two-dimensional array, the first element per 
    entry will have the column name found in the CSV and the 
    second element will have the model.py column name
    """

    columns = [
        ['Tnumber', 'tNumber'], 
        ['First Name', 'name1'], 
        ['Middle Name', 'name2'], 
        ['Last Name', 'name3'], 
        ['Term', 'term'], 
        ['Level', 'level'], 
        ['Primary Program', 'program'], 
        ['Primary College', 'college'],
        ['Primary Department', 'department'],
        ['Decision', 'decision'],
        ['Admit Date', 'admitDate'],
        ['Street Address 1', 'address1'],
        ['Street Address 2', 'address2'],
        ['Street Address 3', 'address3'],
        ['City', 'city'],
        ['State', 'state'],
        ['Zip Code', 'zip'],
        ['Phone Area code', 'areaCode'],
        ['Phone Number', 'phone'],
        ['Phone Extension', 'phoneExt'],
        ['Email Address', 'email'],
        ['UALR Email', 'emailSchool'],
        ['Ethnicity', 'ethnicity'],
        ['Sex', 'sex'],
        ['Admission Type', 'admissionType'],
        ['Student Type', 'studentType'],
    ]

    new_data = []
    for column in columns:
        if column[0] == 'Tnumber':
            new_data.append([column[1],str(entry.name)])
            continue
        
        if column[0] in integerColumns:
            if (str(entry[column[0]]) == 'nan'):
                new_data.append([column[1], "nan"])
                continue

            new_data.append([column[1],str(int(entry[column[0]]))])
            continue

        new_data.append([column[1],str(entry[column[0]])])

    return new_data

def parseCampaign(formattedEntry):
    termEnums = [
        'FALL',
        'SPRING',
        'SUMMER',
    ]
    term_data = formattedEntry[4][1]
    year = term_data.split(" ")[0]
    term = term_data.split(" ")[1].upper()
    if term not in termEnums:
        return "Invalid Term"
    return [year, term]

class accessLevel(enum.Enum):
    caller = 1
    admin = 2
    root = 3

class term(enum.Enum):
    FALL = 1
    SPRING = 2
    SUMMER = 3

class response(enum.Enum):
    ANSWERED_BY_PROSPECTIVE_STUDENT = 1
    ANSWERED_BY_OTHER = 2
    NO_ANSWER = 3
    LEFT_VOICE_MESSAGE = 4
    LEFT_MESSAGE_WITH_OTHER = 5

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

# class ProspectList(db.Model):
#     __tablename__ = 'prospect_list'
#     id = db.Column(db.Integer, primary_key = True)
#     tNumber = db.Column(db.String(9), db.ForeignKey('prospect_import_data.tNumber'), unique = True)
#     campaignStatus = db.Column(db.Boolean)
#     numCampaigns = db.Column(db.Integer)

#     def __init__(self, tNumber):
#         self.tNumber = tNumber
#         self.campaignStatus = True
#         self.numCampaigns = 0

#     def __repr__(self):
#         return "{}({!r})".format(self.__class__.__name__, self.__dict__)

#     def getId(self):
#         return f''


class ProspectImportData(db.Model):
    __tablename__ = 'prospect_import_data'
    id = db.Column(db.Integer, primary_key = True)
    tNumber = db.Column(db.String(9), unique = True)
    #First, Middle, Last Names
    name1 = db.Column(db.String(30), nullable=False)
    name2 = db.Column(db.String(30))
    name3 = db.Column(db.String(30), nullable=False)
    #term = db.Column(db.Text)
    #Might make enum for level
    level = db.Column(db.String(30))
    program = db.Column(db.String(30))
    college = db.Column(db.String(30))
    department = db.Column(db.String(30))
    decision = db.Column(db.Text)
    admitDate = db.Column(db.Text)
    address1 = db.Column(db.String(100), nullable=False)
    address2 = db.Column(db.String(100))
    address3 = db.Column(db.String(100))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(20), nullable=False)
    zip = db.Column(db.String(10), nullable=False)
    areaCode = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.Integer, nullable=False)
    phoneExt = db.Column(db.Integer)
    email = db.Column(db.String(100), nullable=False)
    emailSchool = db.Column(db.String(100), nullable=False)
    ethnicity = db.Column(db.String(100))
    sex = db.Column(db.String(1))
    admissionType = db.Column(db.String(150))
    #Might make studentType an enum
    studentType = db.Column(db.String(200))
    status = db.Column(db.Boolean)

    #Requires entry as pandas dataframe
    def __init__(self, entry):
        formattedEntry = formatEntry(entry)
        
        self.tNumber = formattedEntry[0][1] if formattedEntry[0][1] != "nan" else None
        self.name1 = formattedEntry[1][1] if formattedEntry[1][1] != "nan" else None
        self.name2 = formattedEntry[2][1] if formattedEntry[2][1] != "nan" else None
        self.name3 = formattedEntry[3][1] if formattedEntry[3][1] != "nan" else None
        #self.term = formattedEntry[4][1] if formattedEntry[4][1] != "nan" else None
        self.level = formattedEntry[5][1] if formattedEntry[5][1] != "nan" else None
        self.program = formattedEntry[6][1] if formattedEntry[6][1] != "nan" else None
        self.college = formattedEntry[7][1] if formattedEntry[7][1] != "nan" else None
        self.department = formattedEntry[8][1] if formattedEntry[8][1] != "nan" else None
        self.decision = formattedEntry[9][1] if formattedEntry[9][1] != "nan" else None
        self.admitDate = formattedEntry[10][1] if formattedEntry[10][1] != "nan" else None
        self.address1 = formattedEntry[11][1] if formattedEntry[11][1] != "nan" else None
        self.address2 = formattedEntry[12][1] if formattedEntry[12][1] != "nan" else None
        self.address3 = formattedEntry[13][1] if formattedEntry[13][1] != "nan" else None
        self.city = formattedEntry[14][1] if formattedEntry[14][1] != "nan" else None
        self.state = formattedEntry[15][1] if formattedEntry[15][1] != "nan" else None
        self.zip = formattedEntry[16][1] if formattedEntry[16][1] != "nan" else None
        self.areaCode = formattedEntry[17][1] if formattedEntry[17][1] != "nan" else None
        self.phone = formattedEntry[18][1] if formattedEntry[18][1] != "nan" else None
        self.phoneExt = formattedEntry[19][1] if formattedEntry[19][1] != "nan" else None
        self.email = formattedEntry[20][1] if formattedEntry[20][1] != "nan" else None
        self.emailSchool = formattedEntry[21][1] if formattedEntry[21][1] != "nan" else None
        self.ethnicity = formattedEntry[22][1] if formattedEntry[22][1] != "nan" else None
        self.sex = formattedEntry[23][1] if formattedEntry[23][1] != "nan" else None
        self.admissionType = formattedEntry[24][1] if formattedEntry[24][1] != "nan" else None
        #Might make studentType an enum
        self.studentType = formattedEntry[25][1] if formattedEntry[25][1] != "nan" else None
        self.status = True
        new_sra = ProspectSRA(tNumber=self.tNumber, term=parseCampaign(formattedEntry)[1], year=parseCampaign(formattedEntry)[0])
        db.session.add(new_sra)

    def __repr__(self):
        return "{}({!r})".format(self.__class__.__name__, self.__dict__)

    def getId(self):
        return f''

#Only saves one campaign.  Must be passed year and term on initialization.
#May need to add that information for current campaign to caller table.

class ProspectSRA(db.Model):
    __tablename__ = 'prospect_sra'
    id = db.Column(db.Integer, primary_key=True)
    tNumber = db.Column(db.String(9), db.ForeignKey('prospect_import_data.tNumber'))
    term = db.Column(db.Enum(term))
    year = db.Column(db.Integer, nullable=False)
    #Previous caller and date of call
    wasCalled = db.Column(db.Boolean)
    prevCaller = db.Column(db.String(100))
    dateCalled0 = db.Column(db.DateTime)
    dateCalled1 = db.Column(db.DateTime)
    numTimesCalled = db.Column(db.Integer, nullable=False)
    #Information about previous call
    callResponse = db.Column(db.Enum(response))
    callNotes = db.Column(db.String(500))
    #Information about email
    wasEmailed = db.Column(db.Boolean)
    dateEmailed = db.Column(db.Text)
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

    def getCampaign(self):
        return [self.year, self.term]

    def getId(self):
        return f''

