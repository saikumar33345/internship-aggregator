"""add user oauth fields

Revision ID: debb024c59d5
Revises:
Create Date: 2026-06-25 12:15:30.740504

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "debb024c59d5"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column("username", sa.String(), nullable=True),
    )

    op.add_column(
        "users",
        sa.Column("google_id", sa.String(), nullable=True),
    )

    op.add_column(
        "users",
        sa.Column("auth_provider", sa.String(), nullable=False,server_default="local"),
    )

    op.alter_column(
        "users",
        "password",
        existing_type=sa.VARCHAR(),
        nullable=True,
    )

    op.create_unique_constraint(
        "uq_users_google_id",
        "users",
        ["google_id"],
    )

    op.create_unique_constraint(
        "uq_users_username",
        "users",
        ["username"],
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "uq_users_google_id",
        "users",
        type_="unique",
    )

    op.drop_constraint(
        "uq_users_username",
        "users",
        type_="unique",
    )

    op.alter_column(
        "users",
        "password",
        existing_type=sa.VARCHAR(),
        nullable=False,
    )

    op.drop_column("users", "auth_provider")
    op.drop_column("users", "google_id")
    op.drop_column("users", "username")