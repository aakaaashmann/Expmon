from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal

#create expense req model
class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    category: str
    description: str
    date: date

#expense res model
class ExpenseResponse(BaseModel):
    id: str
    amount: Decimal
    category: str
    description: str
    date: date
    created_at: datetime

    class Config:
        orm_mode = True
