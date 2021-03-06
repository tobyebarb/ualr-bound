from datetime import timedelta, date, datetime
import os
from flask import Flask, request, jsonify, session, make_response
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_mail import Mail, Message
from api.model import db, ValidUser, RegistrationRequest, ProspectImportData, ProspectSRA, formatEntry, parseCampaign
from collections import defaultdict
import pandas as pd



app = Flask(__name__, static_folder='ualr-bound/build', static_url_path='')
CORS(app)

MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
SENDER_NAME = 'Team Inc. LLC'
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')  # Change this!
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('PRODUCTION_DATABASE_URL')
app.config["SQLALCHEMY_TRACK_MODIIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['DEBUG'] = True
app.config['TESTING'] =False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.config['MAIL_DEFAULT_SENDER'] = (SENDER_NAME, MAIL_USERNAME)
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False
app.permanent_session_lifetime = timedelta(minutes=30)
jwt = JWTManager(app)
mail = Mail(app)
db.init_app(app)

ALLOWED_EXTENSION = {'csv'}

with app.app_context():
    db.create_all()

def allowed_files(filename) -> bool :
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSION

""" 
    ~~~Function sendEmail~~~

    Params: emailArray - Array with the following format: [emailRecipient, subjectText, bodyText]

    Desc: Sends emails... I don't know what else to tell you. :>
"""
def sendEmail(emailArray): 
    try:
        print('\nSending email...')
        msg = Message(
                subject = emailArray[1],
                recipients = [emailArray[0]],
                body = emailArray[2]
                )
        mail.send(msg)
        print('\nEmail sent!')
        return True
    except:
        print('\nEmail not sent... :(')
        return False

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

    sra_data = ProspectSRA.query.filter_by(tNumber=new_student[0][1]) #new_student[1] = ['name1', Toby]
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

@app.route("/api/getStudentSRAInfo/<tNumber>", methods=["GET"])
@jwt_required()
@cross_origin()
def getStudentSRAInfo(tNumber):
    student = ProspectSRA.query.filter_by(tNumber=tNumber).first()
    if student:
        jsonData = row2dict(student, [
            "tNumber", 
            "term", 
            "year", 
            "wasCalled", 
            "prevCaller", 
            "dateCalled0", 
            "dateCalled1", 
            "numTimesCalled",
            "callResponse0",
            "callResponse1",
            "callNotes0", 
            "callNotes1", 
            "wasEmailed", 
            "dateEmailed", 
            "emailText",])
        return jsonify(jsonData), 200
    return jsonify({"msg": "student doesn't exist"}), 404
    
@app.route("/api/getNextProspect", methods=["POST"])
@jwt_required()
@cross_origin()
def getNextProspect():
    if request.method == 'POST':

        current_time = datetime.utcnow() # Get current_time
        expiration_interval_delta_time = current_time - timedelta(minutes=30) # Get expired token DateTime object from 30 minutes ago
        call_interval_delta_time = current_time - timedelta(days=2) # Get CALL_INTERVAL token DateTime object from 2 days ago

        #caller = ValidUser.query.filter_by(username=callerUsername).first() # Check for caller if username given in POST body (DEBUG PURPOSES ONLY)

        #if callerUsername == None: # POST body doesn't provide 'username' and caller is found via JWT identity
        caller = ValidUser.query.filter_by(username=get_jwt_identity()).first() # Caller object assigned via JWT

        if caller == None: # If POST body username not given or JWT token's username not matching any users in ValidUser
            return jsonify({'msg': 'Caller not found in database'}), 404

        temp_prospect = ProspectImportData.query.filter_by(assignedCaller=caller.username).first() # Check if current caller already has prospect assigned to them.
        
        print(temp_prospect)
        if temp_prospect:
            temp_sra = ProspectSRA.query.filter_by(tNumber = temp_prospect.tNumber).first()
            print(temp_sra)


        if temp_prospect: # If current caller already has prospect assigned to them, return that prospect's T# and update timeLastAccessed
            print("Caller " + caller.username + " already assigned to prospect with T#: " + temp_prospect.tNumber)
            temp_prospect.timeLastAccessed = current_time
            print(
                "Prospect " + temp_prospect.tNumber + 
                "\nNew timeLastAccessed: " + str(current_time)
                )
            db.session.commit()
            print("Returning already assigned prospect...")
            jsonData = row2dict(temp_prospect, ["tNumber"])
            print("Returning data:", jsonData)
            return jsonify(jsonData), 200

        expired_prospects = ProspectImportData.query.filter(
            (ProspectImportData.timeLastAccessed != None)  
            & (ProspectImportData.assignedCaller != None)
            & (ProspectImportData.timeLastAccessed < expiration_interval_delta_time)
            & (ProspectImportData.status == True)  # Make sure the prospects are active in the campaign
            )

        never_called_prospect_list = ProspectSRA.query.join(ProspectImportData).add_columns(
            ProspectSRA.id, 
            ProspectImportData.tNumber, 
            ProspectImportData.status, 
            ProspectImportData.timeLastAccessed, 
            ProspectImportData.assignedCaller,
            ProspectSRA.wasCalled,
            ProspectSRA.numTimesCalled,
            ).filter(
                (ProspectImportData.status == True)  # Make sure the prospects are active in the campaign
                & (ProspectImportData.assignedCaller == None) # Make sure the prospects don't have a currently assigned caller
                & (ProspectSRA.numTimesCalled == 0) # Make sure the prospects haven't been called more than two times
                & (ProspectImportData.timeLastAccessed == None)
                ).all()

        prospect_list = ProspectSRA.query.join(ProspectImportData).add_columns(
            ProspectSRA.id, 
            ProspectImportData.tNumber, 
            ProspectImportData.status, 
            ProspectImportData.timeLastAccessed, 
            ProspectImportData.assignedCaller,
            ProspectSRA.wasCalled,
            ProspectSRA.numTimesCalled,
            ).filter(
                (ProspectImportData.status == True)  # Make sure the prospects are active in the campaign
                & (ProspectImportData.assignedCaller == None) # Make sure the prospects don't have a currently assigned caller
                & (ProspectSRA.numTimesCalled <= 1) # Make sure the prospects haven't been called more than two times
                & ( # Make sure the prospect haven't been called in the past two days or they haven't been called at all
                    (ProspectImportData.timeLastAccessed < call_interval_delta_time)
                    | (ProspectImportData.timeLastAccessed == None)
                    )
            ).order_by(
                ProspectSRA.numTimesCalled.desc(), # Number of time called has top priority
                ProspectImportData.timeLastAccessed.desc()).all() # Time last accessed as secondary priority

        print("Expired Prospect Count:", expired_prospects.count())
        print("Prospect Count:", len(prospect_list))

        for prospect in prospect_list:
            print("TNUMBER:", prospect.tNumber)

        for prospect in expired_prospects:
            print("EXPIRED TNUMBER:", prospect.tNumber)
                
        if len(prospect_list) == 0 and expired_prospects.count() == 0:
            print("No prospects avaliable")
            return jsonify({'msg': 'No prospects avaliable'}), 400
        
        if expired_prospects.count() > 0:
            """
            If there is a student assigned to a caller who hasn't been updated for 30 minutes,
                1. Update expired student's SRA data to assign to new caller
                2. Update expired students's SRA data to new timeLastAccessed to "current_time"
            """
            prospect = ProspectImportData.query.filter_by(tNumber=expired_prospects[0].tNumber).first()
            if prospect:
                print("Updating expired prospect's assigned caller and time last accessed...")
                prospect.assignedCaller = caller.username
                prospect.timeLastAccessed = current_time
                print(
                    "Prospect " + prospect.tNumber + 
                    "\nNew assignedCaller: " + caller.username + 
                    "\nNew timeLastAccessed: " + str(current_time)
                    )
                db.session.commit()
                print("Returning expired prospect...")
                jsonData = row2dict(prospect, ["tNumber"])
                print("Returning data:", jsonData)
                return jsonify(jsonData), 200
            else:
                return jsonify({'msg': 'Unexpected error: Expired prospect not found.'}), 404

        elif len(never_called_prospect_list) > 0:
            """
            Happy path (no expired students): Provide student who has least calls and latest timeLastAccessed,
                1. Update student's SRA data to assign to new caller
                2. Update students's SRA data to new timeLastAccessed to "current_time"
            """
            prospect = ProspectImportData.query.filter_by(tNumber=never_called_prospect_list[0].tNumber).first()
            if prospect:
                print("Updating prospect's assigned caller and time last accessed...")
                prospect.assignedCaller = caller.username
                prospect.timeLastAccessed = current_time
                print(
                    "Prospect " + prospect.tNumber + 
                    "\nNew assignedCaller: " + caller.username + 
                    "\nNew timeLastAccessed: " + str(current_time)
                    )
                db.session.commit()
                print("Returning prospect...")
                jsonData = row2dict(prospect, ["tNumber"])
                print("Returning data:", jsonData)
                return jsonify(jsonData), 200
            else:
                return jsonify({'msg': 'Unexpected error: Prospect not found.'}), 404

        elif len(prospect_list) > 0:
            """
            Happy path (no expired students): Provide student who has least calls and latest timeLastAccessed,
                1. Update student's SRA data to assign to new caller
                2. Update students's SRA data to new timeLastAccessed to "current_time"
            """
            prospect = ProspectImportData.query.filter_by(tNumber=prospect_list[0].tNumber).first()
            if prospect:
                print("Updating prospect's assigned caller and time last accessed...")
                prospect.assignedCaller = caller.username
                prospect.timeLastAccessed = current_time
                print(
                    "Prospect " + prospect.tNumber + 
                    "\nNew assignedCaller: " + caller.username + 
                    "\nNew timeLastAccessed: " + str(current_time)
                    )
                db.session.commit()
                print("Returning prospect...")
                jsonData = row2dict(prospect, ["tNumber"])
                print("Returning data:", jsonData)
                return jsonify(jsonData), 200
            else:
                return jsonify({'msg': 'Unexpected error: Prospect not found.'}), 404

        if len(prospect_list) == 0:
            return jsonify({'msg': 'No prospects avaliable'}), 404

        return jsonify({'msg': 'Unexpected error: Reached end of method'}), 400
    return jsonify({'msg': 'Request method not supported.'}), 404

@app.route('/api/updateProspectData', methods=["POST"])
@jwt_required()
@cross_origin()
def updateProspectData():
    if request.method == 'POST':
        callResponse = request.json.get("callResponse", None)
        callNotes = request.json.get("callNotes", None)
        emailText = request.json.get("emailText", None)

        current_time = datetime.utcnow()
        
        import_data = ProspectImportData.query.filter_by(assignedCaller=get_jwt_identity()).first()
        sra_data = ProspectSRA.query.filter_by(tNumber = import_data.tNumber).first()
        caller = ValidUser.query.filter_by(username=get_jwt_identity()).first()

        print("Caller " + caller.username + " just called student " + import_data.tNumber)

        print(callResponse)

        if sra_data.numTimesCalled == 0:
            sra_data.callResponse0 = callResponse
            sra_data.callNotes0 = callNotes
            sra_data.dateCalled0 = current_time
        else:
            sra_data.callResponse1 = callResponse
            sra_data.callNotes1 = callNotes
            sra_data.dateCalled1 = current_time

        newNumTimesCalled = sra_data.numTimesCalled + 1

        import_data.timeLastAccessed = current_time
        import_data.assignedCaller = None
        sra_data.wasCalled = True
        sra_data.prevCaller = caller.username
        sra_data.numTimesCalled = newNumTimesCalled

        if newNumTimesCalled == 2 and callResponse != "ANSWERED_BY_PROSPECTIVE_STUDENT": #If answered, then don't email?
            emailSubject = "UALR BOUND - Caller Message"
            if emailText:
                emailBody = emailText
            else:
                emailBody = "We hope you choose to enroll with us at UA - Little Rock.\n\n\n\nThank you for your time."
            emailArray = [import_data.email, emailSubject, emailBody]
            emailSent = sendEmail(emailArray)

            if emailSent:
                sra_data.emailText = emailText
                sra_data.wasEmailed = True
                sra_data.dateEmailed = current_time
                db.session.commit()
                return jsonify({'msg': 'Successfully updated prospect.', 'email_status': True}), 200

            db.session.commit()
            return jsonify({'msg': 'Successfully updated prospect.', 'email_status': False}), 200
        
        db.session.commit()
        return jsonify({'msg': 'Successfully updated prospect.', 'email_status': None}), 200
    return jsonify({'msg': 'Request method not supported.'}), 400
            
@app.route('/message', methods=['GET'])
@jwt_required()
@cross_origin()
def get_message():

    user = get_jwt_identity()
    dictionary = {
        "message": "Hello, " + user
    }

    return jsonify(dictionary)


def getIndex(d, date):
    for i in range(len(d['date'])):
        if d['date'][i] == date:
            return i
    return -1

@app.route("/api/debug", methods=["GET"])
@cross_origin()
def debug():
    current_time = datetime.utcnow() # Get current_time

    import_list = db.session.query(ProspectImportData).all()

    import_list[0].assignedCaller = None
    import_list[0].timeLastAccessed = None
    import_list[1].assignedCaller = None
    import_list[1].timeLastAccessed = None
    import_list[2].assignedCaller = None
    import_list[2].timeLastAccessed = None
    import_list[3].assignedCaller = None
    import_list[4].assignedCaller = None

    prospect_list = db.session.query(ProspectSRA).all()
    print(len(prospect_list))
    print(prospect_list[0])
    print(prospect_list[1])
    print(prospect_list[2])
    print(prospect_list[3])
    print(prospect_list[4])

    prospect_list[0].numTimesCalled = 1
    prospect_list[1].numTimesCalled = 2
    prospect_list[2].numTimesCalled = 2
    prospect_list[3].numTimesCalled = 2
    prospect_list[4].numTimesCalled = 2
    
    prospect_list[0].callResponse1 = None
    
    prospect_list[0].wasEmailed = False
    prospect_list[1].wasEmailed = True
    prospect_list[2].wasEmailed = True
    prospect_list[4].wasEmailed = True

    prospect_list[0].dateCalled0 = current_time - timedelta(days=4)
    prospect_list[0].dateCalled1 = None
    prospect_list[1].dateCalled0 = current_time - timedelta(days=3)
    prospect_list[1].dateCalled1 = current_time - timedelta(hours=3)
    prospect_list[2].dateCalled0 = current_time - timedelta(days=2, hours=8)
    prospect_list[2].dateCalled1 = current_time
    prospect_list[3].dateCalled0 = current_time + timedelta(hours=3)
    prospect_list[4].dateCalled0 = current_time + timedelta(hours=8)
    prospect_list[4].dateCalled1 = current_time + timedelta(days=2, hours=10)

    db.session.commit()


    return jsonify({"msg": "Request method not supported."}), 404

@app.route("/api/getNumberOfCallsMade/<date0>/<date1>", methods=["GET"]) # /api/getNumberOfCallsMade/20211203/20211218
@cross_origin()
def getNumberOfCallsMade(date0, date1):
    if request.method == 'GET':

        formatted_date0 = datetime(int(date0[:4]), int(date0[4:6]), int(date0[6:]))
        formatted_date1 = datetime(int(date1[:4]), int(date1[4:6]), int(date1[6:])) + timedelta(hours=23, minutes=59, seconds=59)


        res = {}
        
        filtered_list = ProspectSRA.query.filter(
            (
                ((ProspectSRA.dateCalled0 >= formatted_date0) & (ProspectSRA.dateCalled0 <= formatted_date1) & (ProspectSRA.dateCalled1 == None)) 
                | 
                ((ProspectSRA.dateCalled1 >= formatted_date0) & (ProspectSRA.dateCalled1 <= formatted_date1)) 
                | 
                ((ProspectSRA.dateCalled0 >= formatted_date0) & (ProspectSRA.dateCalled0 <= formatted_date1))
            )
        )

        print("\nFinding range between " + str(formatted_date0) + " and " + str(formatted_date1) + "\n")
        for i in range(filtered_list.count()):
            #print("T#: " + filtered_list[i].tNumber + " date0: " + str(filtered_list[i].dateCalled0) + " date1: " + str(filtered_list[i].dateCalled1))
            # Need to loop through each prospect in the filtered list and check their date0 if they have only been called once
            # If they have been called twice, check both date0 and date 1, if both are in range, add two to the dates
            if filtered_list[i].numTimesCalled == 1:
                indexed_date = filtered_list[i].dateCalled0
                if indexed_date >= formatted_date0 and indexed_date <= formatted_date1:
                    key = indexed_date.strftime('%Y%m%d')
                    if key in res: # if indexed_date is already in the dictionary, just add to the number of calls made on said indexed_date
                        res[key] += 1
                    else:
                        res[key] = 1

            elif filtered_list[i].numTimesCalled == 2:
                indexed_date0 = filtered_list[i].dateCalled0
                indexed_date1 = filtered_list[i].dateCalled1
                if indexed_date0 >= formatted_date0 and indexed_date0 <= formatted_date1:
                    key = indexed_date0.strftime('%Y%m%d')
                    if key in res: # if indexed_date is already in the dictionary, just add to the number of calls made on said indexed_date
                        res[key] += 1
                    else:
                        res[key] = 1
                
                if indexed_date1 >= formatted_date0 and indexed_date1 <= formatted_date1:
                    key = indexed_date1.strftime('%Y%m%d')
                    if key in res: # if indexed_date is already in the dictionary, just add to the number of calls made on said indexed_date
                        res[key] += 1
                    else:
                        res[key] = 1

        df = convertDict2DataFrame(res)
        df=df.set_index('date')
        resp = make_response(df.to_csv())
        resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
        resp.headers["Content-Type"] = "text/csv"

        #print(res)
        #print(sorted(res))
        #print("AMOUNT:",filtered_list.count())

        return resp
    return jsonify({"msg": "Request method not supported."}), 404

# d = {
#             'date': 
#                 ['20211130', '20211201', '20211202', '20211203', '20211204', '20211205'],
#             'data': [0, 1, 2, 3, 3, 1] 
#             }

def convertDict2DataFrame(dict):
    print(len(dict))

    d = {'date':[],'data':[]}

    for entry in sorted(dict):
        d['date'].append(entry)
        d['data'].append(dict[entry])

    return pd.DataFrame(d)

@app.route("/api/getFullStudentsRatio/", methods=["POST"])
@jwt_required()
@cross_origin()
def getFullStudentsRatio():
    if request.method == 'POST': 
        column_name = request.json.get("column_name", None)

        prospect_list = ProspectSRA.query.join(ProspectImportData)
        res = {}

        if column_name == "sex":
            query = ProspectImportData.query.with_entities(ProspectImportData.sex).distinct()
            titles = [row.sex for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(sex = title).count()
                    res[title]=count
        elif column_name == "ethnicity":
            query = ProspectImportData.query.with_entities(ProspectImportData.ethnicity).distinct()
            titles = [row.ethnicity for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(ethnicity = title).count()
                    res[title]=count
        elif column_name == "admissionType":
            query = ProspectImportData.query.with_entities(ProspectImportData.admissionType).distinct()
            titles = [row.admissionType for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(admissionType = title).count()
                    res[title]=count
        elif column_name == "program":
            query = ProspectImportData.query.with_entities(ProspectImportData.program).distinct()
            titles = [row.program for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(program = title).count()
                    res[title]=count
        elif column_name == "college":
            query = ProspectImportData.query.with_entities(ProspectImportData.college).distinct()
            titles = [row.college for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(college = title).count()
                    res[title]=count
        elif column_name == "department":
            query = ProspectImportData.query.with_entities(ProspectImportData.department).distinct()
            titles = [row.department for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(department = title).count()
                    res[title]=count
        elif column_name == "decision":
            query = ProspectImportData.query.with_entities(ProspectImportData.decision).distinct()
            titles = [row.decision for row in query.all()]
            print(len(titles))
            for title in titles:
                if title != None:
                    count = prospect_list.filter_by(decision = title).count()
                    res[title]=count
        else:
            print('Column name not supported.')

        return jsonify(res), 200
    return jsonify({"msg": "Request method not supported."}), 404

""" 
    ~~~Function getStudentsRatio~~~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Requires: request.json must be in format of {"column_name" : "<column_name>", 
                                                "column_data": {
                                                    "0": "<column_data0>",
                                                    "1": "<column_data1>",
                                                    "N": "<column_dataN>",
                                                    }
                                                }
            The column data must be a type found in the database, i.e, you cannot ask for "Freshman" when pulling from <column_name> = "sex"

    Desc: Returns JSON object for creating ratios of students based on data given in HTTPS POST request body
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~~~Function getStudentsRatio~~~
"""

@app.route("/api/getStudentsRatio/", methods=["POST"])
@cross_origin()
def getStudentsRatio():
    if request.method == 'POST': 
        column_name = request.json.get("column_name", None)
        column_data = request.json.get("column_data", None)

        prospect_list = ProspectSRA.query.join(ProspectImportData)

        res = {}

        for i in range(len(column_data)):
            if column_name == "sex":
                count = prospect_list.filter_by(sex = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "ethnicity":
                count = prospect_list.filter_by(ethnicity = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "admissionType":
                count = prospect_list.filter_by(admissionType = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "program":
                count = prospect_list.filter_by(program = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "college":
                count = prospect_list.filter_by(college = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "department":
                count = prospect_list.filter_by(department = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            elif column_name == "decision":
                count = prospect_list.filter_by(decision = column_data[str(i)]).count()
                res[column_data[str(i)]]=count
            else:
                print('Column name not supported.')

        return jsonify(res), 200
    return jsonify({"msg": "Request method not supported."}), 404

@app.route("/api/getStudentsSRA", methods=["GET"])
@jwt_required()
@cross_origin()
def getStudentsSRA():
    user = ValidUser.query.filter_by(username=get_jwt_identity()).first()

    if str(user.accessLevel) == "accessLevel.root" or str(user.accessLevel) == "accessLevel.admin":
        data = ProspectSRA.query.join(ProspectImportData).add_columns(
            ProspectSRA.tNumber, 
            ProspectImportData.name1, 
            ProspectImportData.name2,
            ProspectImportData.name3,
            ProspectSRA.wasCalled,
            ProspectSRA.numTimesCalled,
            ProspectSRA.callResponse0,
            ProspectSRA.callResponse1,
            ProspectSRA.wasEmailed,
            ProspectImportData.ethnicity,
            ProspectImportData.sex,
            ProspectImportData.program,
            ProspectImportData.college,
            ProspectImportData.department,
            )

        count = data.count()
        jsonData = {}
        for i in range(count):
            d = {}
            d['tNumber'] = data[i].tNumber
            d['name1'] = data[i].name1 
            d['name2'] = data[i].name2
            d['name3'] = data[i].name3
            d['wasCalled'] = data[i].wasCalled
            d['numTimesCalled'] = data[i].numTimesCalled
            d['callResponse0'] = str(data[i].callResponse0).split(".")[1] if data[i].callResponse0 != None else None
            d['callResponse1'] = str(data[i].callResponse1).split(".")[1] if data[i].callResponse1 != None else None
            d['wasEmailed'] = data[i].wasEmailed
            d['ethnicity'] = data[i].ethnicity
            d['sex'] = data[i].sex
            d['program'] = data[i].program
            d['college'] = data[i].college
            d['department'] = data[i].department

            jsonData[i] = d 
        #jsonData = formatQuery(data, count, ["tNumber", "name1", "name2", "name3", "wasCalled", "numTimesCalled", "callResponse0", "callResponse1", "wasEmailed", "ethnicity", "sex", "program", "college", "department"])
        return jsonify(jsonData, 200)
        
    return jsonify({"msg":"fail"}), 401

@app.route("/api/getStudents", methods=["GET"])
@jwt_required()
@cross_origin()
def getStudents():
    user = ValidUser.query.filter_by(username=get_jwt_identity()).first()
    if str(user.accessLevel) == "accessLevel.root" or str(user.accessLevel) == "accessLevel.admin":
        data = db.session.query(ProspectImportData).all()
        count = db.session.query(ProspectImportData).count()

        jsonData = formatQuery(data, count, ["tNumber", "name1", "name2", "name3", "email", "status"])
        return jsonify(jsonData, 200)
        
    return jsonify({"msg":"fail"}), 401

@app.route("/api/uploadFile", methods=["OPTIONS", "POST"])
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
                    emailSubject = "UALR Bound Registration Approval"
                    emailBody = "Your request to join UALR Bound has been approved. You have been added to the current campaign and will now be able to login using the username and password that you provided.\n\n\n\nThank you for your time."
                    emailArray = [regRequest.email, emailSubject, emailBody]
                    emailSent = sendEmail(emailArray)

                    db.session.delete(regRequest) # Delete request
                    db.session.commit()
                    print('\nCreated new user.\n')

                    if not emailSent:
                        return jsonify({"msg":"success", "email_status": False}), 200
                if decision == "deny":
                    print('\nDeleting request...\n')
                    emailSubject = "UALR Bound Registration Denial"
                    emailBody = "Thank you for your submission to join UALR Bound. At this time, your request has been denied for the current campaign. You will still be eligible to register for future campaigns\n\n\n\nThank you for your time."
                    emailArray = [regRequest.email, emailSubject, emailBody]
                    emailSent = sendEmail(emailArray)

                    db.session.delete(regRequest) # Delete request
                    db.session.commit()
                    print('\nDeleted.\n')
                    if not emailSent:
                        return jsonify({"msg":"success", "email_status": False}), 200

                return jsonify({"msg":"success", "email_status": True}), 200
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
        emailMatch = False
        regMatch = False

        print(f'\nRecieved Request:\nName:{name}\nUsername:{username}\nPassword:{password}\nEmail:{email}\nAccess Level:{access_level}\n')
        
        if not name:
            return jsonify({"msg":  "Fill out name field."}), 400
        if not username:
            return jsonify({"msg":  "Fill out username field."}), 400
        if not password:
            return jsonify({"msg":  "Fill out password field."}), 400
        if not email:
            return jsonify({"msg":  "Fill out email field."}), 400
        if not access_level:
            return jsonify({"msg":  "Fill out access level field."}), 400

        if name and username and password and email and access_level:

            if RegistrationRequest.query.filter_by(username=username).first():
                regMatch = True
            if ValidUser.query.filter_by(username=username).first():
                userMatch = True
            if RegistrationRequest.query.filter_by(email=email).first():
                regMatch = True
            if ValidUser.query.filter_by(email=email).first():
                emailMatch = True

            if not (userMatch or regMatch or emailMatch):
                print('\nCreating row in database...\n')
                regRequest = RegistrationRequest(name=name, username=username, password=password, email=email, accessLevel=access_level)
                db.session.add(regRequest)
                db.session.commit()
                print('\nCreated new row.\n')
                emailSubject = "Register Request for UALR BOUND"
                emailBody = "Your registration request for UALR Bound was submitted successfully. A ROOT user of the system will review your request and an email notification will be sent to you upon their decision.\nWe appriciate your wanting to join UALR Bound.\n\n\n\nThank you for your time."
                emailArray = [email, emailSubject, emailBody]
                emailSent = sendEmail(emailArray)
                
                if not emailSent:
                    return jsonify({
                    "user": username,
                    "pass": password,
                    "email": email,
                    "access_level": access_level,
                    "email_status": False
                    }), 200

                return jsonify({
                    "user": username,
                    "pass": password,
                    "email": email,
                    "access_level": access_level,
                    "email_status": True
                    }), 200
            elif userMatch:
                print('\nA user with that username already exists!')
                return jsonify({"msg":  "A user with that username already exists!"}), 400
            elif emailMatch:
                print('\nA user with that email already exists!')
                return jsonify({"msg":  "A user with that email already exists!"}), 400
            elif regMatch:
                print('\nA request with that information is awaiting approval.')
                return jsonify({"msg":  "Information already exists on pending request."}), 400
            else:
                print('\nUnexpected error.')
                return jsonify({"msg":  "Unexpected Error... Try Again."}), 400
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
