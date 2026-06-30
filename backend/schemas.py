from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

# допустимые значения, чтобы не хардкодить везде
STATUSES = ["new", "in_progress", "done"]
PRIORITIES = ["low", "normal", "high"]


class TicketCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = "normal"

    @field_validator("priority")
    def check_priority(cls, v):
        if v not in PRIORITIES:
            raise ValueError("priority должен быть одним из: low, normal, high")
        return v


class TicketStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    def check_status(cls, v):
        if v not in STATUSES:
            raise ValueError("status должен быть одним из: new, in_progress, done")
        return v


class TicketOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ответ списка с пагинацией
class TicketListOut(BaseModel):
    items: List[TicketOut]
    total: int
    page: int
    page_size: int
