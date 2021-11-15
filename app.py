from datetime import timedelta, date
import os
from flask import Flask, request, jsonify
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from api.model import db, ValidUser, RegistrationRequest, ProspectImportData, ProspectSRA, formatEntry, parseCampaign
from collections import defaultdict
import pandas as pd


app = Flask(__name__, static_folder='ualr-bound/build', static_url_path='')
CORS(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')  # Change this!
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('LOCAL_DATABASE_URL')
app.config["SQLALCHEMY_TRACK_MODIIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.permanent_session_lifetime = timedelta(minutes=30)
jwt = JWTManager(app)
db.init_app(app)

ALLOWED_EXTENSION = {'csv'}


with app.app_context():
    db.create_all()

def allowed_files(filename) -> bool :
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSION

def compareStudents(entry, student):
    new_student = formatEntry(entry)
    """
        CASES:
            - Student doesn't exist and is imported directly into prospect_import_data
            - Student does exist, but it is still the same term/year
                - We just need to update their data, not the campaign number or anything in other tables (easy case) make sure to activate campaignStatus
            - Student does exist, but it is a different term/year
                - We need to add a new entry with the same T Number to prospect_sra.
                    Will also have to update their information in prospect_import_data (less easy case) make sure to activate campaignStatus

        If entry is already existing for specific T Number, then we want to not add a new
        entry to the prospect_import_data, but instead we want to check the term they are
        in and make a new entry to prospect_list and up count the number of campaigns they
        are in as well as prospect_sra with new term and year
    """ 
    sameTerm = False
    term=parseCampaign(new_student)[1]
    year=parseCampaign(new_student)[0]

    sra_data = ProspectSRA.query.filter_by(tNumber=new_student[0][1])
    count = sra_data.count()

    for index in range(count): # Go through each entry of sra_data with same T Number and find their year and term
        sra_year, sra_term = sra_data[index].getCampaign() # Assign sra_year and sra_term to be the specific entrys' campaign details
        sra_term = str(sra_term)
        sra_term = sra_term.split(".")[1]
 

        if str(sra_year) == str(year) and str(sra_term) == str(term): # Check if student is in same year ; Might have to split sra_term since it is ENUM
            print("Student " + str(student.tNumber) + " updating with same term")
            sameTerm = True
            student.name1 = new_student[1][1] if new_student[1][1] != "nan" else None
            student.name2 = new_student[2][1] if new_student[2][1] != "nan" else None
            student.name3 = new_student[3][1] if new_student[3][1] != "nan" else None
            #student.term = new_student[4][1] if new_student[4][1] != "nan" else None
            student.level = new_student[5][1] if new_student[5][1] != "nan" else None
            student.program = new_student[6][1] if new_student[6][1] != "nan" else None
            student.college = new_student[7][1] if new_student[7][1] != "nan" else None
            student.department = new_student[8][1] if new_student[8][1] != "nan" else None
            student.decision = new_student[9][1] if new_student[9][1] != "nan" else None
            student.admitDate = new_student[10][1] if new_student[10][1] != "nan" else None
            student.address1 = new_student[11][1] if new_student[11][1] != "nan" else None
            student.address2 = new_student[12][1] if new_student[12][1] != "nan" else None
            student.address3 = new_student[13][1] if new_student[13][1] != "nan" else None
            student.city = new_student[14][1] if new_student[14][1] != "nan" else None
            student.state = new_student[15][1] if new_student[15][1] != "nan" else None
            student.zip = new_student[16][1] if new_student[16][1] != "nan" else None
            student.areaCode = new_student[17][1] if new_student[17][1] != "nan" else None
            student.phone = new_student[18][1] if new_student[18][1] != "nan" else None
            student.phoneExt = new_student[19][1] if new_student[19][1] != "nan" else None
            student.email = new_student[20][1] if new_student[20][1] != "nan" else None
            student.emailSchool = new_student[21][1] if new_student[21][1] != "nan" else None
            student.ethnicity = new_student[22][1] if new_student[22][1] != "nan" else None
            student.sex = new_student[23][1] if new_student[23][1] != "nan" else None
            student.admissionType = new_student[24][1] if new_student[24][1] != "nan" else None
            #Might make studentType an enum
            student.studentType = new_student[25][1] if new_student[25][1] != "nan" else None
            student.status = True
            db.session.commit()
            return

        """
            We need to add a new entry with the same T Number to prospect_sra.
            Will also have to update their information in prospect_import_data (less easy case) make sure to activate campaignStatus
        """
    if not sameTerm:
        print("Student " + str(student.tNumber) + " updating with new term")
        student.name1 = new_student[1][1] if new_student[1][1] != "nan" else None
        student.name2 = new_student[2][1] if new_student[2][1] != "nan" else None
        student.name3 = new_student[3][1] if new_student[3][1] != "nan" else None
        #student.term = new_student[4][1] if new_student[4][1] != "nan" else None
        student.level = new_student[5][1] if new_student[5][1] != "nan" else None
        student.program = new_student[6][1] if new_student[6][1] != "nan" else None
        student.college = new_student[7][1] if new_student[7][1] != "nan" else None
        student.department = new_student[8][1] if new_student[8][1] != "nan" else None
        student.decision = new_student[9][1] if new_student[9][1] != "nan" else None
        student.admitDate = new_student[10][1] if new_student[10][1] != "nan" else None
        student.address1 = new_student[11][1] if new_student[11][1] != "nan" else None
        student.address2 = new_student[12][1] if new_student[12][1] != "nan" else None
        student.address3 = new_student[13][1] if new_student[13][1] != "nan" else None
        student.city = new_student[14][1] if new_student[14][1] != "nan" else None
        student.state = new_student[15][1] if new_student[15][1] != "nan" else None
        student.zip = new_student[16][1] if new_student[16][1] != "nan" else None
        student.areaCode = new_student[17][1] if new_student[17][1] != "nan" else None
        student.phone = new_student[18][1] if new_student[18][1] != "nan" else None
        student.phoneExt = new_student[19][1] if new_student[19][1] != "nan" else None
        student.email = new_student[20][1] if new_student[20][1] != "nan" else None
        student.emailSchool = new_student[21][1] if new_student[21][1] != "nan" else None
        student.ethnicity = new_student[22][1] if new_student[22][1] != "nan" else None
        student.sex = new_student[23][1] if new_student[23][1] != "nan" else None
        student.admissionType = new_student[24][1] if new_student[24][1] != "nan" else None
        #Might make studentType an enum
        student.studentType = new_student[25][1] if new_student[25][1] != "nan" else None
        student.status = True
        new_sra = ProspectSRA(tNumber=new_student[0][1], term=parseCampaign(new_student)[1], year=parseCampaign(new_student)[0])
        db.session.add(new_sra)
        db.session.commit()
        return

@app.route('/message', methods=['GET'])
@jwt_required()
@cross_origin()
def get_message():

    user = get_jwt_identity()
    dictionary = {
        "message": "Hello, " + user
    }

    return jsonify(dictionary)

@app.route("/api/getStudents", methods=["GET"])
@jwt_required()
@cross_origin()
def getStudents():
    user = ValidUser.query.filter_by(username=get_jwt_identity()).first()
    print(user)
    if str(user.accessLevel) == "accessLevel.root" or str(user.accessLevel) == "accessLevel.admin":
        data = db.session.query(ProspectImportData).all()
        count = db.session.query(ProspectImportData).count()

        jsonData = formatQuery(data, count, ["tNumber", "name1", "name2", "name3", "email", "status"])
        return jsonify(jsonData, 200)
        
    return jsonify({"msg":"fail"}), 401

@app.route("/api/uploadFile", methods=["POST"])
@jwt_required()
@cross_origin()
def uploadFile():
    file = request.files["file"]
    
    if allowed_files(file.filename):
        data = pd.read_csv(file, index_col=0)
        data = data.dropna(how = "all")  # Deletes rows that have NaN for all columns
        
        count = data.shape[0]
        for i in range(count):
            entry = data.iloc[i]
            #print(entry)
            
            student = ProspectImportData.query.filter_by(tNumber=entry.name).first()
            if student:
                compareStudents(entry=entry, student=student)
            else:
                new_entry = ProspectImportData(entry)
                db.session.add(new_entry)
        db.session.commit()
        return jsonify({"msg":"Successfully imported CSV file data"}), 200

    return jsonify({"msg":"Not in CSV format"}), 400

@app.route("/api/updateRegistrationRequests", methods=["POST"])
@jwt_required()
@cross_origin()
def updateRegistrationRequests():
    if request.method == 'POST':
        data = request.json
        print("data is " + format(data))
        username = request.json.get("username", None)
        decision = request.json.get("decision", None)

        print(f'\n~Recieved Request~\nUsername: {username}\nDecision: {decision}\n')

        #Update database and convert RegistrationRequest to ValidUser
        if username and decision:
            regRequest = RegistrationRequest.query.filter_by(username=username).first()
            if regRequest:
                print(f'Registration request {regRequest.username} found')
                if decision == "approve":
                    print('\nConverting request into user...\n')
                    user = ValidUser( # Create new user based on the request
                        name=regRequest.name,
                        username=regRequest.username, 
                        password=regRequest.hashedPassword, 
                        email=regRequest.email, 
                        accessLevel=regRequest.accessLevel,
                        activationStatus=True,
                        )
                    db.session.add(user)
                    db.session.delete(regRequest) # Delete request
                    db.session.commit()
                    print('\nCreated new user.\n')
                if decision == "deny":
                    print('\nDeleting request...\n')
                    db.session.delete(regRequest) # Delete request
                    db.session.commit()
                    print('\nDeleted.\n')

                return jsonify({"msg":"success"}), 200
            print("Registration request not found.")
            return jsonify({"msg":"fail"}), 400
    print("Not POST method.")
    return jsonify({"msg":"fail"}), 400

@app.route("/api/getRegistrationRequests", methods=["GET"])
@jwt_required()
@cross_origin()
def getPendingRegistrationRequests():
    user = ValidUser.query.filter_by(username=get_jwt_identity()).first()

    if str(user.accessLevel) == "accessLevel.root" or str(user.accessLevel) == "accessLevel.admin":
        data = db.session.query(RegistrationRequest).all()
        count = db.session.query(RegistrationRequest).count()

        jsonData = formatQuery(data, count, ["id", "name", "username", "email", "accessLevel", "time_created"])
        return jsonify(jsonData, 200)
        
    return jsonify({"msg":"fail"}), 401

@app.route("/api/updateUserInfo/<userID>", methods=["POST"])
@jwt_required()
@cross_origin()
def updateUserInfo(userID):
    if request.method == 'POST':
        # data = request.json
        # print("data is " + format(data))
        id = request.json.get("id", None)
        name = request.json.get("name", None)
        username = request.json.get("username", None)
        email = request.json.get("email", None)
        access_level = request.json.get("accessLevel", None)
        status = request.json.get("activationStatus", None)
        time_created = request.json.get("time_created", None)
        data = [id, name, username, email, access_level, status, time_created]

        #print(f'{id}, {name}, {username}, {email}, {access_level}, {status}, {time_created}')
        user = ValidUser.query.filter_by(id=userID).first()
        if user:
            if name is not None:
                user.name = name
                print('Changing name to ' + name)
            if username is not None:
                user.username = username
                print('Changing username to ' + username)
            if email is not None:
                user.email = email
                print('Changing email to ' + email)
            if access_level is not None:
                user.accessLevel = access_level
                print('Changing access_level to ' + access_level)
            if status is not None:
                user.activationStatus = status
                print('Changing status to ' + str(status))
            db.session.commit()
            return jsonify({"msg": "success"}), 200
        return jsonify({"msg": "user doesn't exist"}), 404
    return jsonify({"msg": "Request method not supported."}), 404

@app.route("/api/getUserInfo/<userID>", methods=["GET"])
@jwt_required()
@cross_origin()
def getUserInfo(userID):
    user = ValidUser.query.filter_by(id=userID).first()
    if user:
        jsonData = row2dict(user, ["id", "name", "username", "email", "accessLevel", "time_created", "activationStatus"])
        #print(jsonData)
        return jsonify(jsonData), 200
    return jsonify({"msg": "user doesn't exist"}), 404

    
@app.route("/api/getStudentInfo/<tNumber>", methods=["GET"])
@jwt_required()
@cross_origin()
def getStudentInfo(tNumber):
    columns = [
        "tNumber", 
        "name1", 
        "name2",
        "name3",
        "level", 
        "program", 
        "college", 
        "department", 
        "decision",
        "admitDate", 
        "address1", 
        "address2",
        "address3",
        "city", 
        "state", 
        "zip", 
        "areaCode", 
        "phone",
        "phoneExt", 
        "email", 
        "emailSchool", 
        "ethnicity",
        "sex", 
        "admissionType", 
        "studentType", 
        "status",
        ]
    student = ProspectImportData.query.filter_by(tNumber=tNumber).first()
    if student:
        jsonData = row2dict(student, wantedColumns=columns)
        #print(jsonData)
        return jsonify(jsonData), 200
    return jsonify({"msg": "student doesn't exist"}), 404

@app.route("/api/getCallers", methods=["GET"])
@jwt_required()
@cross_origin()
def getCallers():
    user = ValidUser.query.filter_by(username=get_jwt_identity()).first()

    if str(user.accessLevel) == "accessLevel.root" or str(user.accessLevel) == "accessLevel.admin":
        data = db.session.query(ValidUser).all()
        count = db.session.query(ValidUser).count()
        
        jsonData = formatQuery(data, count, ["id", "name", "accessLevel", "time_created", "activationStatus"])

        return jsonify(jsonData, 200)
    return jsonify({"msg":"fail"}), 401

@app.route("/api/updateStudentInfo/<tNumber>", methods=["POST"])
@jwt_required()
@cross_origin()
def updateStudentInfo(tNumber):
    if request.method == 'POST': 
        tNum = request.json.get("tNumber", None)
        name1 = request.json.get("name1", None)
        name2 = request.json.get("name2", None)
        name3 = request.json.get("name3", None)
        # term = request.json.get("term", None)
        # level = request.json.get("level", None)
        program = request.json.get("program", None)
        college = request.json.get("college", None)
        department = request.json.get("department", None)
        decision = request.json.get("decision", None)
        admitDate = request.json.get("admitDate", None)
        address1 = request.json.get("address1", None)
        address2 = request.json.get("address2", None)
        address3 = request.json.get("address3", None)
        city = request.json.get("city", None)
        state = request.json.get("state", None)
        zip = request.json.get("zip", None)
        areaCode = request.json.get("areaCode", None)
        phone = request.json.get("phone", None)
        phoneExt = request.json.get("phoneExt", None)
        email = request.json.get("email", None)
        emailSchool = request.json.get("emailSchool", None)
        ethnicity = request.json.get("ethnicity", None)
        sex = request.json.get("sex", None)
        admissionType = request.json.get("admissionType", None)
        studentType = request.json.get("studentType", None)
        status = request.json.get("status", None)
      
        student = ProspectImportData.query.filter_by(tNumber=tNumber).first()
        if student:
            if tNum is not None:
                student.tNumber = tNum
                print('Changing tNum to ' + tNum)
            if name1 is not None:
                student.name1 = name1
                print('Changing name1 to ' + name1)
            if name2 is not None:
                student.name2 = name2
                print('Changing name2 to ' + name2)
            if name3 is not None:
                student.name3 = name3
                print('Changing name3 to ' + name3)
            if program is not None:
                student.program = program
                print('Changing program to ' + program)
            if college is not None:
                student.college = college
                print('Changing college to ' + college)
            if department is not None:
                student.department = department
                print('Changing department to ' + department)
            if decision is not None:
                student.decision = decision
                print('Changing decision to ' + decision)
            if admitDate is not None:
                student.admitDate = admitDate
                print('Changing admitDate to ' + admitDate)
            if address1 is not None:
                student.address1 = address1
                print('Changing address1 to ' + address1)
            if address2 is not None:
                student.address2 = address2
                print('Changing address2 to ' + address2)
            if address3 is not None:
                student.address3 = address3
                print('Changing address3 to ' + address3)
            if city is not None:
                student.city = city
                print('Changing city to ' + city)
            if state is not None:
                student.state = state
                print('Changing state to ' + state)
            if zip is not None:
                student.zip = zip
                print('Changing zip to ' + zip)
            if areaCode is not None:
                student.areaCode = areaCode
                print('Changing areaCode to ' + areaCode)
            if phone is not None:
                student.phone = phone
                print('Changing phone to ' + phone)
            if phoneExt is not None:
                student.phoneExt = phoneExt
                print('Changing phoneExt to ' + phoneExt)
            if email is not None:
                student.email = email
                print('Changing email to ' + email)
            if emailSchool is not None:
                student.emailSchool = emailSchool
                print('Changing emailSchool to ' + emailSchool)
            if ethnicity is not None:
                student.ethnicity = ethnicity
                print('Changing ethnicity to ' + ethnicity)
            if sex is not None:
                student.sex = sex
                print('Changing sex to ' + sex)
            if admissionType is not None:
                student.admissionType = admissionType
                print('Changing admissionType to ' + admissionType)
            if studentType is not None:
                student.studentType = studentType
                print('Changing studentType to ' + studentType)
            if status is not None:
                student.status = status
                print('Changing status to ' + str(status))
            db.session.commit()
            return jsonify({"msg": "success"}), 200
        return jsonify({"msg": "student doesn't exist"}), 404
    return jsonify({"msg": "Request method not supported."}), 404

def row2dict(row, wantedColumns):
    d = {}
    for column in row.__table__.columns:
        if column.name in wantedColumns:
            d[column.name] = str(getattr(row, column.name))
    return d

def formatQuery(data, rowCount, wantedColumns):
    jsonData = {}
    for i in range(rowCount):
        jsonData[i] = row2dict(data[i], wantedColumns)
    return jsonData

@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    if request.method == 'POST':
        name = request.json.get("name", None)
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        email = request.json.get("email", None)
        access_level = request.json.get("access-level", None)
        userMatch = False
        regMatch = False

        print(f'\nRecieved Request:\nName:{name}\nUsername:{username}\nPassword:{password}\nEmail:{email}\nAccess Level:{access_level}\n')
        
        if name and username and password and email and access_level:

            if RegistrationRequest.query.filter_by(username=username).first():
                regMatch = True
            if ValidUser.query.filter_by(username=username).first():
                userMatch = True
            if RegistrationRequest.query.filter_by(email=email).first():
                regMatch = True
            if ValidUser.query.filter_by(email=email).first():
                userMatch = True

            if not (userMatch or regMatch):
                print('\nCreating row in database...\n')
                regRequest = RegistrationRequest(name=name, username=username, password=password, email=email, accessLevel=access_level)
                db.session.add(regRequest)
                db.session.commit()
                print('\nCreated new row.\n')

                return jsonify({
                    "user": username,
                    "pass": password,
                    "email": email,
                    "access_level": access_level,
                    }), 200
            elif userMatch:
                print('\nA user with that information already exists!')
                return jsonify({"msg":  "Information already exists among valid users."}), 400
            else:
                print('\nA request with that information is awaiting approval.')
                return jsonify({"msg":  "Information already exists on pending request."}), 400
    #access_token = create_access_token(identity=username)
    #return jsonify(access_token=access_token)

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/token", methods=["POST"]) 
@cross_origin()
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = ValidUser.query.filter_by(username=username).first() #Note: valid users will be <User <username>> || invalid user will be None

    if user:
        if ValidUser.verify_password(self=user, pwd=password):
            access_token = create_access_token(identity=username)
            email = user.email
            access_level = str(user.accessLevel)
            print('Login successful.')
            print(f'{username}, {email}, {access_level}')
            return jsonify(access_token=access_token, username=username, email=email, access_level=access_level), 200
        else:
            print('Invalid password.')
            return jsonify({"msg": "Invalid password."}), 401
    else:
        print('User does not exist.')
        return jsonify({"msg": "User does not exist."}), 401

@app.errorhandler(404)
@cross_origin()
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
