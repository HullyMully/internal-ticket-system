import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base


# время в utc, без таймзоны (наивное), но мы всегда пишем utc
def utc_now():
    return datetime.datetime.utcnow()


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    # статусы: new / in_progress / done
    status = Column(String, nullable=False, default="new")
    # приоритеты: low / normal / high
    priority = Column(String, nullable=False, default="normal")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
