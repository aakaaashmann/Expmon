# Expense Tracker

## Live Application

Frontend: ( https://expmon-frontend-dwfcugbwd-aakaaashmanns-projects.vercel.app )  
Backend API: ( https://expmon-backend.onrender.com )

---

## Tech Stack

Backend
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic

Frontend
- React (Vite)
- Axios

---

## Features Implemented

- Create new expense (amount, category, description, date)
- View all expenses
- Filter by category
- Sort by date (newest first)
- Display total of currently visible expenses
- Idempotent expense creation (retry-safe)
- Backend validation for positive amounts
- Basic loading and error states in UI

---

## Key Design Decisions

1. Money Handling

Used Numeric(10,2) in the database and Decimal in Pydantic to avoid floating-point precision issues.  
This ensures financial correctness.

2. Idempotency for Real-World Reliability

Implemented idempotent POST /expenses using an Idempotency-Key header.

If the same request is retried due to:
- Network issues
- Page refresh
- Multiple button clicks

The backend returns the original expense instead of creating duplicates.

3. Persistence Choice

Used SQLite for:
- Lightweight setup
- Persistent storage
- Production-like behavior
- Simplicity within time constraints

For larger systems, PostgreSQL would be preferred.

4. Defensive API Design

- Validation with Pydantic
- Prevent negative or zero amounts
- Reject invalid sort parameters
- UUID-based primary keys

5. Frontend Resilience

- Separate loading states for submission and list fetching
- Prevent duplicate submissions
- Error messages for failed API calls
- Client-side validation

---

## Trade-offs Due to Time Constraint

- No authentication system
- No pagination
- Minimal UI styling
- No automated tests
- No category summary view

Priority was given to correctness and reliability over UI complexity.

---

## Future Improvements

- Add summary view (total per category)
- Add pagination
- Add integration tests
- Replace SQLite with PostgreSQL
- Improve UI styling

---

## How to Run Locally

Backend

cd backend  
python -m venv .venv  
.\.venv\Scripts\activate  
pip install -r requirements.txt  
uvicorn app.main:app --reload  

Frontend

cd frontend  
npm install  
npm run dev  

---

## Notes

This implementation focuses on:
- Data correctness
- Handling unreliable network conditions
- Clean structure
- Production-oriented thinking
