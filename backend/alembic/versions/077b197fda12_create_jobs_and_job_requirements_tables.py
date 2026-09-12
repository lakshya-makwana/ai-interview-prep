"""create_jobs_and_job_requirements_tables

Revision ID: 077b197fda12
Revises: fb177b67f04f
Create Date: 2026-09-12 13:31:15.877629

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '077b197fda12'
down_revision: Union[str, Sequence[str], None] = 'fb177b67f04f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('jobs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('company_name', sa.String(), nullable=True),
    sa.Column('job_description', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_id'), 'jobs', ['id'], unique=False)

    op.create_table('job_requirements',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('job_id', sa.Integer(), nullable=False),
    sa.Column('required_skills', sa.Text(), nullable=True),
    sa.Column('preferred_skills', sa.Text(), nullable=True),
    sa.Column('responsibilities', sa.Text(), nullable=True),
    sa.Column('qualifications', sa.Text(), nullable=True),
    sa.Column('experience_requirements', sa.Text(), nullable=True),
    sa.Column('technologies', sa.Text(), nullable=True),
    sa.Column('domain_knowledge', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('job_id')
    )
    op.create_index(op.f('ix_job_requirements_id'), 'job_requirements', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_job_requirements_id'), table_name='job_requirements')
    op.drop_table('job_requirements')
    op.drop_index(op.f('ix_jobs_id'), table_name='jobs')
    op.drop_table('jobs')
