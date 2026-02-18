from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/expenses", response_model=schemas.ExpenseResponse)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
):
    pass


@app.get("/expenses", response_model=list[schemas.ExpenseResponse])
def read_expenses(
    category: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    pass