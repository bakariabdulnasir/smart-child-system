class Config:

    SQLALCHEMY_DATABASE_URI = "sqlite:///smart_child.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = "supersecretkey"

    JWT_SECRET_KEY = " this-is-a-very-secure-jwt-secret-key-2026"

    # Email configuration
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587
    EMAIL_USERNAME = "your-email@gmail.com"
    EMAIL_PASSWORD = "your-app-password"
    FRONTEND_URL = "http://localhost:3000"
