from flask import Response, request, make_response, jsonify
from database.models import Machine, User
from flask_restful import Resource
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
import re


class MachinesApi(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        machines = Machine.objects(added_by=user_id).to_json()
        return Response(machines, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        regex_ip = re.compile(
            r'^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
        regex_not_whitespace = re.compile(r'.*\S.*')

        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            machine = Machine(**body, added_by=user)

            if not regex_ip.match(machine.ip):
                return make_response(
                    jsonify(
                        {"message": "IP is invalid"}
                    ),
                    400
                )

            if not regex_not_whitespace.match(machine.username):
                return make_response(
                    jsonify(
                        {"message": "Username is invalid"}
                    ),
                    400
                )

            if not regex_not_whitespace.match(machine.password):
                return make_response(
                    jsonify(
                        {"message": "Password is invalid"}
                    ),
                    400
                )

            machine.save()
            user.update(push__machines=machine)
            user.save()
            return make_response(
                jsonify(
                    machine
                ),
                200
            )

        except (NotUniqueError):
            return make_response(
                jsonify(
                    {"message": "Machine already exist"}
                ),
                400
            )
        except (FieldDoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Field don't exist"}
                ),
                400
            )
        except Exception as e:
            return make_response(
                jsonify(
                    {"message": "Internal error"}
                ),
                500
            )


class MachineApi(Resource):
    @jwt_required()
    def get(self, id):
        try:
            user_id = get_jwt_identity()
            machine = Machine.objects.get(id=id)

            if str(machine.added_by.id) != str(user_id):
                return make_response(
                    jsonify(
                        {"message": "Token not autorize"}
                    ),
                    400
                )

            return make_response(
                jsonify(
                    machine
                ),
                200
            )

        except (ValidationError):
            return make_response(
                jsonify(
                    {"message": "Not a valid Id"}
                ),
                400
            )
            
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Machine don't exist"}
                ),
                400
            )
        except Exception as e:
            return make_response(
                jsonify(
                    {"message": "Internal error"}
                ),
                500
            )

    @jwt_required()
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            machine = Machine.objects.get(id=id)

            if str(machine.added_by.id) != str(user_id):
                return make_response(
                    jsonify(
                        {"message": "Token not autorize"}
                    ),
                    400
                )

            machine.delete()

            return make_response(
                jsonify(
                    {"message": "Machine with the {id} deleted with success".format(
                        id=id)}
                ),
                200
            )

        except (ValidationError):
            return make_response(
                jsonify(
                    {"message": "Not a valid Id"}
                ),
                400
            )

        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Machine don't exist"}
                ),
                400
            )

        except Exception as e:
            return make_response(
                jsonify(
                    {"message": "Internal error"}
                ),
                500
            )
