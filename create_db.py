import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:"
    f"{os.getenv('MYSQL_PASSWORD')}@"
    f"{os.getenv('MYSQL_HOST')}"
)

DATABASE_NAME = os.getenv("MYSQL_DB")

engine = create_engine(DATABASE_URL)

with engine.connect() as connection:

    connection.execute(
        text(f"CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}")
    )

    print(f"Database '{DATABASE_NAME}' created successfully.")