from .users import UsersApi, LoginApi, UserApi, UserProfileApi, UserPasswordApi
from .machine import MachinesApi, MachineApi
from .scan import ScanApi


def initialize_routes(api):
 api.add_resource(UsersApi, '/api/users')
 api.add_resource(UserApi, '/api/users/<id>')
 api.add_resource(LoginApi, '/api/auth/login')
 api.add_resource(UserProfileApi, '/api/auth/profile')
 api.add_resource(UserPasswordApi, '/api/auth/changepassword')
 api.add_resource(MachinesApi, '/api/machines')
 api.add_resource(MachineApi, '/api/machines/<id>')
 api.add_resource(ScanApi, '/api/scan/<machine_id>')
