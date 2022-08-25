from flask import Response, request, make_response, jsonify
from database.models import User
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError, OperationError
from flask_bcrypt import generate_password_hash
import datetime
import re


class UsersApi(Resource):
    def get(self):
        users = User.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    def post(self):
        regex_name = re.compile(r'^[A-Z][a-z]+$')
        regex_phone = re.compile(r'(0|91)?[7-9][0-9]{8}')
        regex_email = re.compile(
            r'^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+$')
        regex_password = re.compile(
            r'^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,16}$')

        try:
            body = request.get_json()
            user = User(**body)

            if not regex_name.match(user.first_name):
                return make_response(
                    jsonify(
                        {"message": "First name is invalid"}
                    ),
                    400
                )

            if not regex_name.match(user.last_name):
                return make_response(
                    jsonify(
                        {"message": "Last name is invalid"}
                    ),
                    400
                )

            if not regex_phone.match(user.phone_number):
                return make_response(
                    jsonify(
                        {"message": "Phone number is invalid"}
                    ),
                    400
                )
            if not regex_email.match(user.email):
                return make_response(
                    jsonify(
                        {"message": "Email is invalid"}
                    ),
                    400
                )

            if not regex_password.match(user.password):
                return make_response(
                    jsonify(
                        {"message": "Password must contain at least 8 caracters, one uppercase, one lowercase and one number"}
                    ),
                    400
                )

            user.hash_password()
            user.save()
            return make_response(
                jsonify(
                    user
                ),
                200
            )

        except (ValidationError):
            return make_response(
                jsonify(
                    {"message": "Request is missing required fields"}
                ),
                400
            )
        except (NotUniqueError):
            return make_response(
                jsonify(
                    {"message": "User already exist"}
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


class UserPasswordApi(Resource):
    @jwt_required()
    def post(self):
        regex_password = re.compile(
            r'^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,16}$')
        
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)

            if not body.get("oldPassword"):
                return make_response(
                    jsonify(
                        {"message": "Old password is required"}
                    ),
                    400
                )

            if not body.get("newPassword"):
                return make_response(
                    jsonify(
                        {"message": "New password is required"}
                    ),
                    400
                )

            if not user.check_password(body.get('oldPassword')):
                return make_response(
                    jsonify(
                        {"message": "Old password is incorrect"}
                    ),
                    400
                )

            if body.get('oldPassword') == body.get('newPassword'):
                return make_response(
                    jsonify(
                        {"message": "Old password is equals to new password"}
                    ),
                    400
                )

            if not regex_password.match(body.get('newPassword')):
                return make_response(
                    jsonify(
                        {"message": "Password must contain at least 8 caracters, one uppercase, one lowercase and one number"}
                    ),
                    400
                )
            newPassword = generate_password_hash(body.get('newPassword')).decode('utf8')
            user.update(password=newPassword)

            return make_response(
                jsonify(
                    {"message": "Password changed with success"}
                ),
                200
            )
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "User don't exist"}
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


class UserProfileApi(Resource):
    @jwt_required()
    def put(self):
        regex_name = re.compile(r'^[A-Z][a-z]+$')
        regex_phone = re.compile(r'(0|91)?[7-9][0-9]{8}')

        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)

            if body.get("password"):
                return make_response(
                    jsonify(
                        {"message": "Can't edit password"}
                    ),
                    400
                )

            if body.get("email"):
                return make_response(
                    jsonify(
                        {"message": "Can't edit email"}
                    ),
                    400
                )

            if body.get("machines"):
                return make_response(
                    jsonify(
                        {"message": "Can't edit machines"}
                    ),
                    400
                )

            if body.get("id"):
                return make_response(
                    jsonify(
                        {"message": "Can't edit id"}
                    ),
                    400
                )

            if body.get("first_name") and not regex_name.match(body.get("first_name")):
                return make_response(
                    jsonify(
                        {"message": "First name is invalid"}
                    ),
                    400
                )

            if body.get("last_name") and not regex_name.match(body.get("last_name")):
                return make_response(
                    jsonify(
                        {"message": "Last name is invalid"}
                    ),
                    400
                )

            if body.get("phone_number") and not regex_phone.match(body.get("phone_number")):
                return make_response(
                    jsonify(
                        {"message": "Phone number is invalid"}
                    ),
                    400
                )

            user.update(**body)

            new_user = User.objects.get(id=user_id)

            return make_response(
                jsonify(
                    new_user
                ),
                200
            )

        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "User don't exist"}
                ),
                400
            )
        except (OperationError):
            return make_response(
                jsonify(
                    {"message": "Parameters is required"}
                ),
                400
            )
        except (InvalidQueryError):
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

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)
        return make_response(
            jsonify(
                user
            ),
            200
        )


class UserApi(Resource):
    def delete(self, id):
        try:
            user = User.objects.get(id=id).delete()
            return make_response(
                jsonify(
                    {"message": "User with the {id} deleted with success".format(
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
                    {"message": "User don't exist"}
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


class LoginApi(Resource):
    def post(self):
        try:
            body = request.get_json()
            user = User.objects.get(email=body.get('email'))
            authorized = user.check_password(body.get('password'))
            if not authorized:
                return make_response(
                    jsonify(
                        {"message": "Password Incorrect"}
                    ),
                    401
                )

            expires = datetime.timedelta(days=7)
            access_token = create_access_token(
                identity=str(user.id), expires_delta=expires)
            return {'token': access_token}, 200
        except (DoesNotExist):
            return make_response(
                jsonify(
                    {"message": "Email don't exist"}
                ),
                401
            )
        except Exception as e:
            return make_response(
                jsonify(
                    {"message": "Internal error"}
                ),
                500
            )
