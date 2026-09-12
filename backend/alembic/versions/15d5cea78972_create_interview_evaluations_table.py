"""create_interview_evaluations_table

Revision ID: 15d5cea78972
Revises: f76487f61149
Create Date: 2026-09-12 17:12:38.157929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '15d5cea78972'
down_revision: Union[str, Sequence[str], None] = 'f76487f61149'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'interview_evaluations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('interview_question_id', sa.Integer(), nullable=False),
        sa.Column('technical_correctness', sa.Float(), nullable=False),
        sa.Column('completeness', sa.Float(), nullable=False),
        sa.Column('relevance', sa.Float(), nullable=False),
        sa.Column('communication', sa.Float(), nullable=False),
        sa.Column('overall_score', sa.Float(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('strengths', sa.JSON(), nullable=False),
        sa.Column('missing_concepts', sa.JSON(), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['interview_question_id'], ['interview_questions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_interview_evaluations_id'), 'interview_evaluations', ['id'], unique=False)
    op.create_index(op.f('ix_interview_evaluations_interview_question_id'), 'interview_evaluations', ['interview_question_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_interview_evaluations_interview_question_id'), table_name='interview_evaluations')
    op.drop_index(op.f('ix_interview_evaluations_id'), table_name='interview_evaluations')
    op.drop_table('interview_evaluations')
