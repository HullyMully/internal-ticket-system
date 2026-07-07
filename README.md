# Internal Ticket System

Небольшое приложение для учёта внутренних заявок. 

[![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

[🇺🇸English](./README.en.md) | 🇷🇺Русский

## Стек

- Backend: Python + FastAPI + SQLAlchemy
- Frontend: React + TypeScript (Vite)
- База данных: SQLite

## Возможности

- создание заявки;
- список заявок;
- фильтрация по статусу и приоритету;
- поиск по названию и описанию;
- сортировка по дате создания и приоритету;
- смена статуса;
- удаление заявки (только админ);
- пагинация.

Поиск, фильтрация, сортировка и пагинация считаются на backend.

## Бизнес-правила

- админский аккаунт с дефолтными кредами `admin:admin` (нужен только для удаления);
- заявку в статусе `done` нельзя редактировать или удалять;
- из `done` нельзя вернуть заявку в другой статус;
- при нарушении правила API возвращает осмысленную ошибку.

## Как запустить

### Backend

```
cd backend
python -m venv venv
source venv/bin/activate        # windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                  # необязательно, накидает тестовые заявки
uvicorn main:app --reload
```

API поднимется на http://localhost:8000 (доки на /docs).

### Frontend

```
cd frontend
npm install
npm run dev
```

Фронт поднимется на http://localhost:5173 и ходит в backend на localhost:8000.

## API кратко

- `POST /tickets` — создать заявку
- `GET /tickets` — список (параметры: status, priority, search, sort_by, order, page, page_size)
- `PATCH /tickets/{id}/status` — поменять статус
- `DELETE /tickets/{id}` — удалить (нужен Basic Auth admin:admin)
- `GET /admin/me` — проверка кред админа
