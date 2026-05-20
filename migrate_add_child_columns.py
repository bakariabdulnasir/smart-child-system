#!/usr/bin/env python3
"""
Migration script to add new columns to the children table in the SQLite database.
Adds: school, medical_notes, allergies, emergency_contact, emergency_phone
"""

import sqlite3
import sys

def migrate():
    db_path = "instance/smart_child.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check current columns
        cursor.execute("PRAGMA table_info(children)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Current columns in children table: {columns}")
        
        # Add school column if it doesn't exist
        if "school" not in columns:
            cursor.execute("""
                ALTER TABLE children 
                ADD COLUMN school VARCHAR(200)
            """)
            print("Added column: school")
        else:
            print("Column school already exists")
        
        # Add medical_notes column if it doesn't exist
        if "medical_notes" not in columns:
            cursor.execute("""
                ALTER TABLE children 
                ADD COLUMN medical_notes TEXT
            """)
            print("Added column: medical_notes")
        else:
            print("Column medical_notes already exists")
        
        # Add allergies column if it doesn't exist
        if "allergies" not in columns:
            cursor.execute("""
                ALTER TABLE children 
                ADD COLUMN allergies TEXT
            """)
            print("Added column: allergies")
        else:
            print("Column allergies already exists")
        
        # Add emergency_contact column if it doesn't exist
        if "emergency_contact" not in columns:
            cursor.execute("""
                ALTER TABLE children 
                ADD COLUMN emergency_contact VARCHAR(150)
            """)
            print("Added column: emergency_contact")
        else:
            print("Column emergency_contact already exists")
        
        # Add emergency_phone column if it doesn't exist
        if "emergency_phone" not in columns:
            cursor.execute("""
                ALTER TABLE children 
                ADD COLUMN emergency_phone VARCHAR(50)
            """)
            print("Added column: emergency_phone")
        else:
            print("Column emergency_phone already exists")
        
        conn.commit()
        
        # Verify columns after migration
        cursor.execute("PRAGMA table_info(children)")
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
