from flask import Flask

from app.config.config import Config

from app.extensions.extensions import (
    db,
    migrate,
    bcrypt,
    ma
)

from app.models import *

from app.routes.auth_routes import auth_bp


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    ma.init_app(app)

    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    return app