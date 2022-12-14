from tkinter import UNITS
from flask_restful import Resource
from flask import make_response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import  DoesNotExist
from database.models import EventLog, Machine, User, Disk, Scan, Software
import wmi
import pythoncom
from flask_cors import cross_origin


class ScanApi(Resource):
    @cross_origin()
    @jwt_required()
    def post(self, machine_id):
        user_id = get_jwt_identity()
    
        try:            
            user = User.objects.get(id=user_id)
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "User don't exist"}
                ),
                400
            )
        
        try:          
            machine = Machine.objects.get(id=machine_id)
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Machine don't exist"}
                ),
                400
            )
        
        if str(machine.added_by.id) != str(user_id):
                return make_response(
                    jsonify(
                        {"message": "Token not autorize"}
                    ),
                    400
                )

        pythoncom.CoInitialize ()
        try:
            
            c = wmi.WMI(machine.ip, user=machine.username, password=machine.password)

            scan = Scan()

            scan.system_type = c.Win32_ComputerSystem()[0].SystemType
            scan.user = c.Win32_ComputerSystem()[0].UserName
            scan.operative_system = "{0}  ({1})".format(c.Win32_OperatingSystem()[0].caption, c.Win32_OperatingSystem()[0].OSArchitecture)
            scan.manufacturer = c.Win32_ComputerSystem()[0].Manufacturer
            scan.model = c.Win32_ComputerSystem()[0].Model
            scan.memory = convert_bytes(int(c.Win32_ComputerSystem()[0].TotalPhysicalMemory))
            scan.processor = c.Win32_Processor()[0].Name
            scan.motherboard = "{0} {1}".format(c.Win32_BaseBoard()[0].manufacturer, c.Win32_BaseBoard()[0].product)
            scan.graphic = c.Win32_VideoController()[0].Name
            
            for disk in c.Win32_LogicalDisk():
               name = disk.name
               size = convert_bytes(int(disk.size))
               free_space = convert_bytes(int(disk.FreeSpace))
               disk = Disk(name=name, size=size, free_space=free_space)
               scan.disks.append(disk)

            for s in c.Win32_Product():
                if s.Name and s.Version and s.Vendor:
                    name = s.Name
                    version = s.Version
                    publisher = s.Vendor
                    software = Software(name=name, version=version, publisher=publisher)
                    scan.softwares.append(software)
            
            i = 0
            for e in c.Win32_NTLogEvent(EventType=2):
                if e.SourceName and e.Message and e.EventType and i < 20:
                    name = e.SourceName
                    message = e.Message
                    event_type = e.EventType
                    type= e.Type
                    event = EventLog(name=name, message=message, event_type=event_type, type=type)
                    scan.eventlog.append(event)
                    i = i + 1
            
            j = 0
            for e in c.Win32_NTLogEvent(EventType=1):
                if e.SourceName and e.Message and e.EventType and j < 20:
                    name = e.SourceName
                    message = e.Message
                    event_type = e.EventType
                    type= e.Type
                    event = EventLog(name=name, message=message, event_type=event_type, type=type)
                    scan.eventlog.append(event)
                    j = j + 1
                    
            scan.machine = machine
            scan.save()
            machine.update(push__scans=scan)
            machine.save()

        except (wmi.x_access_denied):
            return make_response(
            jsonify(
                {"message": "Acess denied"}
            ),
            400
        )
        except (wmi.x_wmi):
            return make_response(
            jsonify(
                {"message": "Scan not possible"}
            ),
            400
        )

        finally:
            pythoncom.CoUninitialize ()
        

        return make_response(
            jsonify(
                scan
            ),
            200
        )


    @jwt_required()
    def get(self, machine_id):

        user_id = get_jwt_identity()
    
        try:            
            user = User.objects.get(id=user_id)
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "User don't exist"}
                ),
                400
            )
        
        try:          
            machine = Machine.objects.get(id=machine_id)
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Machine don't exist"}
                ),
                400
            )
        
        if str(machine.added_by.id) != str(user_id):
                return make_response(
                    jsonify(
                        {"message": "Token not autorize"}
                    ),
                    400
                )
        try:

            scans = Scan.objects(machine=machine.id).order_by('-date')
            print (len(scans))

            if len(scans)>0:

                return make_response(  
                    jsonify(
                        scans[0]
                    )
                    ,
                    200
                )
            else:
                return make_response(  
                    jsonify(
                        {"message": "No scans for this machine"}
                    )
                    ,
                    200
                )

        except Exception as e:
            return make_response(
                jsonify(
                    {"message": "Internal Error"}
                ),
                500
            )

def convert_bytes(bytes_number): 
    return round(bytes_number/ 1024**3)

