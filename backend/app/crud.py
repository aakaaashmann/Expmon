from sqlalchemy.orm import Session
from . import models, schemas

def get_expense_by_idempotency(db: Session, key: str):
    return db.query(models.Expense).filter(
        models.Expense.idempotency_key == key
    ).first()

def create_expense(db: Session, expense: schemas.ExpenseCreate, key: str):
    db_expense = models.Expense(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date,
        idempotency_key=key
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, category: str = None, sort: str = None):
    query = db.query(models.Expense)

    if category:
        query = query.filter(models.Expense.category == category)

    if sort == "date_desc":
        query = query.order_by(models.Expense.date.desc())

    return query.all()
