"""add password column to users

Revision ID: 833a74308ea3
Revises: 
Create Date: 2025-03-22 22:19:48.189090

"""
from typing import Sequence, Union

from sqlmodel import SQLModel, Field
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '833a74308ea3'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 使用 sqlmodel 的 String 類型（實際會在遷移中使用 sqlalchemy 的 String 類型）
    op.add_column('users', sa.Column('password', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'password')