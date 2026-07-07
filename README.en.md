# Internal Ticket System

A small application for tracking internal tickets.

[![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

🇺🇸English | [🇷🇺Русский](./README.md)

## Stack

- Backend: Python + FastAPI + SQLAlchemy
- Frontend: React + TypeScript (Vite)
- Database: SQLite

## Features

- Create ticket;
- List of tickets;
- Filter by status and priority;
- Search by name and description;
- Sorting by creation date and priority;
- Change status;
- Delete ticket (admin only);
- Pagination.

Search, filter, sort, and pagination are performed on the backend.

## Business Rules

- Admin account with default credentials `admin:admin` (only needed for deletion);
- Tickets in the `done` status cannot be edited or deleted;
- A ticket in the `done` status cannot be reverted to a different status;
- If the rule is violated, the API returns a meaningful error.

## How to run

### Backend

```
cd backend
python -m venv venv
source venv/bin/activate # windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py # optional, will generate test requests
uvicorn main:app --reload
```

The API will run on http://localhost:8000 (docs at /docs).

### Frontend

```
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173 and access the backend on localhost:8000.

## API in brief

- `POST /tickets` — create a ticket
- ​​`GET /tickets` — list (parameters: status, priority, search, sort_by, order, page, page_size)
- `PATCH /tickets/{id}/status` — change status
- `DELETE /tickets/{id}` — delete (requires Basic Auth admin:admin)
- `GET /admin/me` — verify admin credentials