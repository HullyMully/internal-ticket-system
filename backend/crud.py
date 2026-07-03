# тут вся работа с базой по заявкам
from sqlalchemy import or_, asc, desc, case
from models import Ticket


def create_ticket(db, data):
    ticket = Ticket(
        title=data.title,
        description=data.description,
        priority=data.priority,
        status="new",  # новая заявка всегда new
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_ticket(db, ticket_id):
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()


def get_tickets(db, status=None, priority=None, search=None,
                sort_by="created_at", order="desc", page=1, page_size=10):
    query = db.query(Ticket)

    # фильтры
    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)

    # поиск по title и description
    if search:
        like = "%" + search + "%"
        query = query.filter(or_(Ticket.title.like(like), Ticket.description.like(like)))

    # считаем сколько всего до пагинации
    total = query.count()

    # сортировка. для приоритета делаем свой порядок через case
    if sort_by == "priority":
        order_field = case(
            (Ticket.priority == "high", 3),
            (Ticket.priority == "normal", 2),
            (Ticket.priority == "low", 1),
            else_=0,
        )
    else:
        order_field = Ticket.created_at

    if order == "asc":
        query = query.order_by(asc(order_field))
    else:
        query = query.order_by(desc(order_field))

    # пагинация
    if page < 1:
        page = 1
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return items, total


def update_status(db, ticket, new_status):
    ticket.status = new_status
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db, ticket):
    db.delete(ticket)
    db.commit()
