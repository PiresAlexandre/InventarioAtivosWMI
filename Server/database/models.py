from enum import unique
from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash


class Machine(db.Document):
    ip = db.StringField(required=True, unique=True)
    username =  db.StringField(required=True)
    password = db.StringField(required=True)
    added_by = db.ReferenceField('User')

class User(db.Document):
    first_name = db.StringField(required=True)
    last_name =  db.StringField(required=True)
    phone_number =  db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True)
    machines = db.ListField(db.ReferenceField('Machine', reverse_delete_rule=db.PULL))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
 
    def check_password(self, password):
        return check_password_hash(self.password, password)


User.register_delete_rule(Machine, 'added_by', db.CASCADE)