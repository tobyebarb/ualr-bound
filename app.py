from datetime import timedelta, date
import os
from flask import Flask, request, jsonify
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from api.model import db, ValidUser, RegistrationRequest
from collections import defaultdict


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


with app.app_context():
    db.create_all()

@app.route('/message', methods=['GET'])
@jwt_required()
@cross_origin()
def get_message():

    user = get_jwt_identity()
    dictionary = {
        "message": "Hello, " + user
    }

    return jsonify(dictionary)

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
def getPendingRegistrationRequests(): #TODO: Add user authentication (check if user is ROOT/ADMIN)
    #user = get_jwt_identity()
    data = db.session.query(RegistrationRequest).all()
    count = db.session.query(RegistrationRequest).count()

    jsonData = formatQuery(data, count, ["id", "name", "username", "email", "accessLevel", "time_created"])
    return jsonify(jsonData, 200)

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

@app.route("/api/getCallers", methods=["GET"])
@jwt_required()
@cross_origin()
def getCallers(): #TODO: Add user authentication (check if user is ROOT/ADMIN)
    #user = get_jwt_identity()

    data = db.session.query(ValidUser).all()
    count = db.session.query(ValidUser).count()
    
    jsonData = formatQuery(data, count, ["id", "name", "accessLevel", "time_created", "activationStatus"])

    return jsonify(jsonData, 200)

#@app.route("/api/getStudents", methods=["GET"])
#@jwt_required()
#@cross_origin()
#def getStudents(): 
#   
#   data = db.session.query(ProspectImportData).all()
#   count = db.session.query(ProspectImportData).count()
#   jsonData = formatQuery(data, count, ["TNumber", "name", "email", "status"])
#   return jsonify(jsonData, 200)

#@app.route("/api/updateStudentInfo/<TNumber>", methods=["POST"])
#@jwt_required()
#@cross_origin()
#def updateStudentInfo(TNumber):
#   if request.method == 'POST': 
#       TNumber = request.json.get("TNumber", None)
#       firstName = request.json.get("firstName", None)
#       middleName = request.json.get("middleName", None)
#       lastName = request.json.get("lastName", None)
#       term = request.json.get("term", None)
#       level = request.json.get("level", None)
#       primaryProgram = request.json.get("primaryProgram", None)
#       primaryCollege = request.json.get("primaryCollege", None)
#       primaryDepartment = request.json.get("primaryDepartment", None)
#       admitDate = request.json.get("admitDate", None)
#       streetAddress = request.json.get("streetAddress", None)
#       streetAddressTwo = request.json.get("streetAddressTwo", None)
#       streetAddressThree = request.json.get("streetAddressThree", None)
#       city = request.json.get("city", None)
#       state = request.json.get("state", None)
#       zipcode = request.json.get("zipcode", None)
#       phoneAreaCode = request.json.get("phoneAreaCode", None)
#       phoneNumber = request.json.get("phoneNumber", None)
#       phoneExtension = request.json.get("phoneExtension", None)
#       email = request.json.get("email", None)
#       ualrEmail = request.json.get("ualrEmail", None)
#       ethnicity = request.json.get("ethnicity", None)
#       sex = request.json.get("sex", None)
#       admissionType = request.json.get("admissionType", None)
#       studentType = request.json.get("studentType", None)
#       status = request.json.get("activationStatus", None)
#       data = [
#           TNumber,
#           firstName,
#           middleName,
#           lastName,
#           term,
#           level,
#           primaryProgram,
#           primaryCollege,
#           primaryDepartment,
#           admitDate,
#           streetAddress,
#           streetAddressTwo,
#           streetAddressThree,
#           city,
#           state,
#           zipcode,
#           phoneAreaCode,
#           phoneNumber,
#           phoneExtension,
#           email,
#           ualrEmail,
#           ethnicity,
#           sex,
#           admissionType,
#           studentType,
#           status]

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
