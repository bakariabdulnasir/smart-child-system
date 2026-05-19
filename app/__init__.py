from flask import Flask
import jwt

from app.config.config import Config

from app.extensions.extensions import (
    db,
    migrate,
    bcrypt,
    ma,
    jwt
)

from app.models import *

from app.routes.auth_routes import auth_bp

from app.routes.admin_routes import admin_bp

from app.routes.user_routes import user_bp  

from app.routes.child_routes import child_bp

from app.routes.task_routes import task_bp

from app.routes.schedule_routes import schedule_bp

from app.routes.reminder_routes import reminder_bp

from app.routes.notification_routes import notification_bp 

from app.routes.event_routes import event_bp

from app.routes.dashboard_routes import dashboard_bp    

from app.routes.trusted_contact_routes import trusted_contact_bp    

from app.routes.community_support_routes import (
    community_support_bp
)   
from app.routes.file_upload_routes import file_upload_bp    

from flask import send_from_directory

from app.routes.location_routes import location_bp



def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(dashboard_bp, url_prefix="/api")  
    app.register_blueprint(trusted_contact_bp, url_prefix="/api") 
    app.register_blueprint(community_support_bp, url_prefix="/api")     
    app.register_blueprint(notification_bp, url_prefix="/api")
    app.register_blueprint(location_bp, url_prefix="/api")
    app.register_blueprint(file_upload_bp, url_prefix="/api")
    app.register_blueprint(
    child_bp,
    url_prefix="/api"
)
    app.register_blueprint(schedule_bp, url_prefix="/api")
    app.register_blueprint(task_bp, url_prefix="/api")
    app.register_blueprint(reminder_bp, url_prefix="/api")
    app.register_blueprint(event_bp, url_prefix="/api")

    @app.route(
        "/uploads/<path:filename>"
    )
    def uploaded_file(filename):

        return send_from_directory(
            app.config["UPLOAD_FOLDER"],
            filename
        )

    with app.app_context():
        db.create_all()

    return app