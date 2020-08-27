from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

app = Flask(__name__)
# app.config["DEBUG"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    FirstName = db.Column(db.String(20))
    LastName = db.Column(db.String(20))
    MiddleName = db.Column(db.String(20))
    DoB = db.Column(db.String)
    AccountNumber = db.Column(db.String(10))
    Phone = db.Column(db.String(20))
    ResidentialAddress = db.Column(db.String(100))
    Balance = db.Column(db.Integer)
    AccountFreeze = db.Column(db.Boolean, default=False)
    CardNumber = db.Column(db.String(15))
    SpendLimit = db.Column(db.Integer)
    CardBlock = db.Column(db.Boolean, default=False)
    TravelNotification = db.Column(db.String)
    CreditScore = db.Column(db.Integer)
    ATMPin = db.Column(db.String(4))

    def __repr__(self):
        return '<User %>' % self.id


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/add")
def add():
    return render_template('addUser.html')


@app.route("/display")
def display():
    users = User.query.all()
    # users = User.query.filter(User.AccountNumber == 1122334455).all()
    return render_template('displayUser.html', users=users)


@app.route("/addUser", methods=['POST', 'GET'])
def addUser():
    if request.method == "POST":
        FirstName = request.form['FirstName']
        LastName = request.form['LastName']
        MiddleName = request.form['MiddleName']
        DoB = request.form['DoB']
        AccountNumber = request.form['AccountNumber']
        Phone = request.form['Phone']
        ResidentialAddress = request.form['ResidentialAddress']
        Balance = request.form['Balance']

        if request.form.get("AccountFreeze"):
            AccountFreeze = True
        else:
            AccountFreeze = False

        CardNumber = request.form['CardNumber']
        SpendLimit = request.form['SpendLimit']

        if request.form.get("CardBlock"):
            CardBlock = True
        else:
            CardBlock = False

        TravelNotification = request.form['TravelNotification']
        CreditScore = request.form['CreditScore']
        ATMPin = request.form['ATMPin']

        new_user = User(FirstName=FirstName, LastName=LastName, MiddleName=MiddleName, DoB=DoB,
                        AccountNumber=AccountNumber, Phone=Phone, ResidentialAddress=ResidentialAddress,
                        Balance=Balance,
                        AccountFreeze=AccountFreeze, CardNumber=CardNumber, SpendLimit=SpendLimit, CardBlock=CardBlock,
                        TravelNotification=TravelNotification, CreditScore=CreditScore, ATMPin=ATMPin)

        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect('/display')
        except:
            return "There was an error adding the user ..."
    else:
        return render_template('addUser.html')


# @app.route("/deleteUser")
# def deleteUser():
#     try:
#         User.query.filter(User.id == 1).delete()
#         db.session.commit()
#         return 'User deleted'
#     except: 
#         return 'Could not delete user'

@app.route("/authenticate", methods=['POST'])
def authenticate():
    if request.method == "POST":
        AccountNumber = request.form.get("AccountNumber")
        try:
            exists = db.session.query(db.session.query(User).filter_by(AccountNumber=AccountNumber).exists()).scalar()
            if exists:
                users = User.query.filter(User.AccountNumber == AccountNumber).all()
                if users:
                    data = []
                    for user in users:
                        userObject = {'FirstName': user.FirstName, 'date_created': user.date_created,
                                      'LastName': user.LastName, 'MiddleName': user.MiddleName, 'DoB': user.DoB,
                                      'Phone': user.Phone, 'ResidentialAddress': user.ResidentialAddress,
                                      'AccountFreeze': user.AccountFreeze, 'AccountNumber': user.AccountNumber,
                                      'CardNumber': user.CardNumber, 'SpendLimit': user.SpendLimit,
                                      'CardBlock': user.CardBlock, 'TravelNotification': user.TravelNotification,
                                      'CreditScore': user.CreditScore, 'ATMPin': user.ATMPin, 'Balance': user.Balance}
                        data.append(userObject)
                        # print(userObject)
                    # print(data)
                    return jsonify({'user': 'Account exists', 'data': data})
                else:
                    return jsonify({'error': 'Could not retrieve data'})
            else:
                return jsonify({'error': 'Account does not exist'})
        except:
            return jsonify({'error': 'Problem with server'})
    else:
        return jsonify({'error': 'Bad request'})


@app.route("/spendlimit", methods=['POST'])
def spendlimit():
    if request.method == 'POST':
        AccountNumber = request.form.get("AccountNumber")
        SpendLimit = request.form.get('SpendLimit')

        try:
            user = User.query.filter_by(AccountNumber=AccountNumber).first()
            user.SpendLimit = SpendLimit
            db.session.commit()
            return jsonify({'success': 'Spend limit updated'})
        except:
            return jsonify({'error': 'There was a problem with the server'})


@app.route("/cardblock", methods=['POST'])
def cardblock():
    if request.method == 'POST':
        AccountNumber = request.form.get("AccountNumber")
        try:
            user = User.query.filter_by(AccountNumber=AccountNumber).first()
            user.CardBlock = True
            db.session.commit()
            return jsonify({'success': 'Card has been blocked'})
        except:
            return jsonify({'error': 'There was a problem with the server'})
    else:
        return jsonify({'error': 'Bad request'})


@app.route("/accountfreeze", methods=['POST'])
def accountfreeze():
    if request.method == 'POST':
        AccountNumber = request.form.get("AccountNumber")
        try:
            user = User.query.filter_by(AccountNumber=AccountNumber).first()
            user.AccountFreeze = True
            db.session.commit()
            return jsonify({'success': 'Account has been frozen'})
        except:
            return jsonify({'error': 'There was a problem with the server'})
        else:
            return jsonify({'error': 'Bar request'})

@app.route('/travelnotification', methods=['POST'])
def travelnotification():
    if request.method == 'POST':
        AccountNumber = request.form.get("AccountNumber")
        TravelNotification = request.form.get("TravelNotification")
        try:
            user = User.query.filter_by(AccountNumber=AccountNumber).first()
            user.TravelNotification = TravelNotification
            db.session.commit()
            return jsonify({'success': 'Travel Notification has been set'})
        except:
            return jsonify({'error': 'There was a problem with the server'})
        else:
            return jsonify({'error': 'Bad request'})

# if __name__ == '__main__':
#     app.run(debug=True)
