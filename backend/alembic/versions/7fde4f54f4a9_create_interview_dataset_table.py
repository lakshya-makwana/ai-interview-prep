"""create_interview_dataset_table

Revision ID: 7fde4f54f4a9
Revises: 15d5cea78972
Create Date: 2026-09-12 17:57:16.886760

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7fde4f54f4a9'
down_revision: Union[str, Sequence[str], None] = '15d5cea78972'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'interview_dataset',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('interview_id', sa.Integer(), nullable=False),
        sa.Column('interview_question_id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=True),
        sa.Column('topic', sa.String(), nullable=False),
        sa.Column('difficulty', sa.String(), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('candidate_answer', sa.Text(), nullable=False),
        sa.Column('technical_correctness', sa.Float(), nullable=False),
        sa.Column('completeness', sa.Float(), nullable=False),
        sa.Column('relevance', sa.Float(), nullable=False),
        sa.Column('communication', sa.Float(), nullable=False),
        sa.Column('overall_score', sa.Float(), nullable=False),
        sa.Column('strengths', sa.JSON(), nullable=False),
        sa.Column('missing_concepts', sa.JSON(), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['interview_id'], ['interviews.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['interview_question_id'], ['interview_questions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_interview_dataset_id'), 'interview_dataset', ['id'], unique=False)
    op.create_index(op.f('ix_interview_dataset_user_id'), 'interview_dataset', ['user_id'], unique=False)
    op.create_index(op.f('ix_interview_dataset_interview_id'), 'interview_dataset', ['interview_id'], unique=False)
    op.create_index(op.f('ix_interview_dataset_interview_question_id'), 'interview_dataset', ['interview_question_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_interview_dataset_interview_question_id'), table_name='interview_dataset')
    op.drop_index(op.f('ix_interview_dataset_interview_id'), table_name='interview_dataset')
    op.drop_index(op.f('ix_interview_dataset_user_id'), table_name='interview_dataset')
    op.drop_index(op.f('ix_interview_dataset_id'), table_name='interview_dataset')
    op.drop_table('interview_dataset')
