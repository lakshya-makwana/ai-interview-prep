"""create_interviews_and_interview_questions_tables

Revision ID: f76487f61149
Revises: d4dd3dcb006c
Create Date: 2026-09-12 16:52:49.486914

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f76487f61149'
down_revision: Union[str, Sequence[str], None] = 'd4dd3dcb006c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('interviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('job_id', sa.Integer(), nullable=True),
    sa.Column('interview_type', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('total_questions', sa.Integer(), nullable=False),
    sa.Column('current_question', sa.Integer(), nullable=False),
    sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_interviews_id'), 'interviews', ['id'], unique=False)
    op.create_index(op.f('ix_interviews_status'), 'interviews', ['status'], unique=False)
    op.create_index(op.f('ix_interviews_user_id'), 'interviews', ['user_id'], unique=False)

    op.create_table('interview_questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('interview_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.String(), nullable=False),
    sa.Column('question_text', sa.Text(), nullable=False),
    sa.Column('topic', sa.String(), nullable=False),
    sa.Column('difficulty', sa.String(), nullable=False),
    sa.Column('display_order', sa.Integer(), nullable=False),
    sa.Column('candidate_answer', sa.Text(), nullable=True),
    sa.Column('answered_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['interview_id'], ['interviews.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_interview_questions_id'), 'interview_questions', ['id'], unique=False)
    op.create_index(op.f('ix_interview_questions_interview_id'), 'interview_questions', ['interview_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_interview_questions_interview_id'), table_name='interview_questions')
    op.drop_index(op.f('ix_interview_questions_id'), table_name='interview_questions')
    op.drop_table('interview_questions')
    op.drop_index(op.f('ix_interviews_user_id'), table_name='interviews')
    op.drop_index(op.f('ix_interviews_status'), table_name='interviews')
    op.drop_index(op.f('ix_interviews_id'), table_name='interviews')
    op.drop_table('interviews')

