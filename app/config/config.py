import os


class Config:

    SQLALCHEMY_DATABASE_URI = (
        "sqlite:///smart_child.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = "supersecretkey"

    JWT_SECRET_KEY = (
        "this-is-a-very-secure-jwt-secret-key-2026"
    )

    # EMAIL CONFIGURATION

    EMAIL_HOST = "smtp.gmail.com"

    EMAIL_PORT = 587

    EMAIL_USERNAME = "your-email@gmail.com"

    EMAIL_PASSWORD = "your-app-password"

    FRONTEND_URL = "http://localhost:3000"

    # FILE UPLOAD CONFIGURATION

    BASE_DIR = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../"
        )
    )

    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "uploads"
    )

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024