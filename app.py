from datetime import timedelta
import os
from flask import Flask, request, jsonify
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from api.model import db, ValidUser


app = Flask(__name__, static_folder='ualr-bound/build', static_url_path='')
CORS(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')  # Change this!
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
app.config["SQLALCHEMY_TRACK_MODIIFICATIONS"] = False
app. permanent_session_lifetime = timedelta(minutes=5)
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

@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    if request.method == 'POST':
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        email = request.json.get("email", None)
        access_level = request.json.get("access-level", None)

        print(f'\nRecieved Request:\nUsername:{username}\nPassword:{password}\nEmail:{email}\nAccess Level:{access_level}\n')
        
        if username and password and email and access_level:
            print('\nCreating row in database...\n')
            validUser = ValidUser(username=username, password=password, email=email, accessLevel=access_level, activationStatus=True)
            db.session.add(validUser)
            db.session.commit()
            print('\nCreated new row.\n')

        return jsonify({
            "user": username,
            "pass": password,
            "email": email,
            "access_level": access_level,
            }), 200
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
            print('Login successful.')
            return jsonify(access_token=access_token), 200
        else:
            print('Invalid password.')
            return jsonify({"msg": "Invalid password."}), 401
    else:
        print('User does not exist.')
        return jsonify({"msg": "User does not exist."}), 401

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)