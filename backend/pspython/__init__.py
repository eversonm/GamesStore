import os

from blocklist import BLOCKLIST
from connection import POSTGRES
from db import db
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_smorest import Api


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "PS Python React"
    # configs for Swagger
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config[
        "OPENAPI_SWAGGER_UI_URL"
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
    # os.getenv(
    #     "DATABASE_URL",
    #     "sqlite:///data.db"
    # )
    app.config["JWT_SECRET_KEY"] = "4314987211440494425041130277451580228"
    
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # @app.before_first_request
    # def create_tables():
    #     db.create_all()

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @jwt.additional_claims_loader
    def add_claims_to_jwt(identity):  # Remember identity is what we define when creating the access token
        if identity == 1:   # instead of hard-coding, we should read from a config file or database to get a list of admins instead
            return {'is_admin': True}
        return {'is_admin': False}

    # This method will check if a token is blacklisted, and will be called automatically when blacklist is enabled
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload['jti'] in BLOCKLIST  # Here we blacklist particular JWTs that have been created in the past.

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "description": "The token has been revoked.",
            'error': 'token_revoked'
        }), 401

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({
            "description": "The token is not fresh.",
            'error': 'fresh_token_required'
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'message': 'The token has expired.',
            'error': 'token_expired'
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):  # we have to keep the argument here, since it's passed in by the caller internally
        return jsonify({
            'message': 'Signature verification failed.',
            'error': 'invalid_token'
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "description": "Request does not contain an access token.",
            'error': 'authorization_required'
        }), 401

    api = Api(app)

    from resources.order import blp as OrderBlueprint
    from resources.product import blp as ProductBlueprint
    from resources.user import blp as UserBlueprint
    api.register_blueprint(UserBlueprint)
    api.register_blueprint(ProductBlueprint)
    api.register_blueprint(OrderBlueprint)

    
    return app
