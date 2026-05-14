#!/usr/bin/env python3
"""
Migration script to add reset_password_token and reset_password_expires columns
to the users table in the SQLite database.
"""

import sqlite3
import sys
from datetime import datetime

def migrate():
    db_path = "instance/smart_child.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check current columns
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        # Add reset_password_token column if it doesn't exist
        if "reset_password_token" not in columns:
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN reset_password_token VARCHAR(255)
            """)
            print("Added column: reset_password_token")
        else:
            print("Column reset_password_token already exists")
        
        # Add reset_password_expires column if it doesn't exist
        if "reset_password_expires" not in columns:
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN reset_password_expires DATETIME
            """)
            print("Added column: reset_password_expires")
        else:
            print("Column reset_password_expires already exists")
        
        conn.commit()
        
        # Verify columns after migration
        cursor.execute("PRAGMA table_info(users)")
        columns_after = [row[1] for row in cursor.fetchall()]
        print(f"Columns after migration: {columns_after}")
        
        conn.close()
        print("Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        return False


if __name__ == "__main__":
    success = migrate()
    sys.exit(0 if success else 1)
