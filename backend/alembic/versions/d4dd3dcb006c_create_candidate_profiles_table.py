"""create_candidate_profiles_table

Revision ID: d4dd3dcb006c
Revises: 077b197fda12
Create Date: 2026-09-12 14:49:31.991691

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd4dd3dcb006c'
down_revision: Union[str, Sequence[str], None] = '077b197fda12'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('candidate_profiles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('resume_id', sa.Integer(), nullable=False),
    sa.Column('skills', sa.Text(), nullable=True),
    sa.Column('verified_skills', sa.Text(), nullable=True),
    sa.Column('skills_verified', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('resume_id')
    )
    op.create_index(op.f('ix_candidate_profiles_id'), 'candidate_profiles', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_candidate_profiles_id'), table_name='candidate_profiles')
    op.drop_table('candidate_profiles')
