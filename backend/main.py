from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import engine, get_db
from auth import require_admin

# создаём таблицы при старте (миграций тут нет, проект маленький)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Internal Ticket System")

# разрешаем фронту стучаться. для теста ставлю *
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


# проверка кред админа (для формы логина на фронте)
@app.get("/admin/me")
def admin_me(admin: str = Depends(require_admin)):
    return {"username": admin}


# создать заявку
@app.post("/tickets", response_model=schemas.TicketOut, status_code=201)
def create_ticket(data: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, data)


# список заявок с фильтрами/поиском/сортировкой/пагинацией
@app.get("/tickets", response_model=schemas.TicketListOut)
def list_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # маленькая валидация фильтров, чтобы не искать мусор
    if status and status not in schemas.STATUSES:
        raise HTTPException(status_code=400, detail="Неверный статус для фильтра")
    if priority and priority not in schemas.PRIORITIES:
        raise HTTPException(status_code=400, detail="Неверный приоритет для фильтра")
    if sort_by not in ["created_at", "priority"]:
        raise HTTPException(status_code=400, detail="Сортировать можно по created_at или priority")

    items, total = crud.get_tickets(
        db, status, priority, search, sort_by, order, page, page_size
    )
    return {"items": items, "total": total, "page": page, "page_size": page_size}


# поменять статус заявки
@app.patch("/tickets/{ticket_id}/status", response_model=schemas.TicketOut)
def change_status(ticket_id: int, data: schemas.TicketStatusUpdate, db: Session = Depends(get_db)):
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    # done нельзя трогать вообще (ни редактировать, ни вернуть назад)
    if ticket.status == "done":
        raise HTTPException(
            status_code=409,
            detail="Заявка в статусе done, её нельзя изменить",
        )

    return crud.update_status(db, ticket, data.status)


# удалить заявку. только админ. done удалять нельзя
@app.delete("/tickets/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), admin: str = Depends(require_admin)):
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    if ticket.status == "done":
        raise HTTPException(
            status_code=409,
            detail="Заявку в статусе done удалять нельзя",
        )

    crud.delete_ticket(db, ticket)
    return
