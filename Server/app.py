from flask import Flask
from database.db import initialize_db
from flask_restful import Api
from resources.routes import initialize_routes
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from os import environ


app = Flask(__name__)

app.config["MONGODB_SETTINGS"] = {
    "host": 'mongodb+srv://{0}:{1}@clusterinventario.5ajzhc8.mongodb.net/{2}?retryWrites=true&w=majority'.
    format(environ.get('MONGODB_USERNAME'), environ.get(
        'MONGODB_PASSWORD'), environ.get('MONGODB_DATABASE_NAME'))
}

app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY')

api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

initialize_db(app)


initialize_routes(api)

if __name__ == '__main__':
    app.run()
