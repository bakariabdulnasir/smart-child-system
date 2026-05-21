"""Add child_id to events table

Revision ID: add_child_id_to_events
Revises: 
Create Date: 2024-01-01

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = 'add_child_id_to_events'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add child_id column to events table
    op.add_column('events', sa.Column('child_id', sa.Integer(), sa.ForeignKey('children.id'), nullable=True))


def downgrade():
    # Remove child_id column from events table
    op.drop_column('events', 'child_id')
