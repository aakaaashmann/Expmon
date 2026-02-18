from sqlalchemy import Column, String, Date, DateTime
from sqlalchemy.sql import func
from sqlalchemy.types import Numeric
import uuid

from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    idempotency_key = Column(String, unique=True, nullable=False)
