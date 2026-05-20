"""
Database initialization script to create required roles.
Run this script after creating the database to initialize roles.
"""

from app import create_app
from app.extensions.extensions import db
from app.models.role import Role


def init_roles():
    """Initialize default roles in the database."""
    
    app = create_app()
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if roles already exist
        existing_roles = Role.query.all()
        if existing_roles:
            print("Roles already exist in database:")
            for role in existing_roles:
                print(f"  - {role.name}")
            return
        
        # Create default roles
        roles = [
            Role(name="parent"),
            Role(name="caregiver"),
            Role(name="admin"),
        ]
        
        for role in roles:
            db.session.add(role)
        
        db.session.commit()
        
        print("Roles created successfully:")
        for role in roles:
            print(f"  - {role.name}")


if __name__ == "__main__":
    init_roles()
