from email import message
from platform import machine
from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime


def get_current_date():
    return datetime.utcnow()

class Disk(db.EmbeddedDocument):
    name = db.StringField(required=True)
    size = db.IntField(required=True)
    free_space = db.IntField(required=True)

class Software(db.EmbeddedDocument):
    name = db.StringField(required=True)
    version = db.StringField(required=True)
    publisher = db.StringField(required=True)

class EventLog(db.EmbeddedDocument):
    name = db.StringField(required=True)
    message = db.StringField(required=True)
    event_type = db.IntField(required=True)
    type = db.StringField(required=True)
    

class Scan(db.Document):
    system_type = db.StringField(required=True)
    user = db.StringField(required=True)
    operative_system = db.StringField(required=True)
    manufacturer = db.StringField(required=True)
    model = db.StringField(required=True)
    memory = db.IntField(required=True)
    processor = db.StringField(required=True)
    motherboard = db.StringField(required=True)
    graphic = db.StringField(required=True)
    disks = db.EmbeddedDocumentListField(Disk)
    eventlog = db.EmbeddedDocumentListField(EventLog)
    softwares = db.EmbeddedDocumentListField(Software)
    date = db.DateTimeField(required=True, default=get_current_date)
    machine = db.ReferenceField('Machine')



class Machine(db.Document):
    ip = db.StringField(required=True, unique=True)
    username =  db.StringField(required=True)
    password = db.StringField(required=True)
    added_by = db.ReferenceField('User')
    scans = db.ListField(db.ReferenceField('Scan', reverse_delete_rule=db.PULL))



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
Machine.register_delete_rule(Scan, 'machine', db.CASCADE)