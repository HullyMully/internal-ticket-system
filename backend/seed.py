# скрипт чтобы накидать тестовых заявок в базу
# запускать: python seed.py
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

samples = [
    ("Не работает принтер на 3 этаже", "Печатает с полосами", "normal"),
    ("Запросить доступ к 1С", "Новому бухгалтеру нужен доступ", "high"),
    ("Поменять картридж", None, "low"),
    ("Ошибка при входе в почту", "Пишет неверный пароль, хотя пароль правильный", "high"),
    ("Купить новые мышки", "Старые отваливаются", "low"),
]


def run():
    db = SessionLocal()
    for title, desc, prio in samples:
        t = models.Ticket(title=title, description=desc, priority=prio, status="new")
        db.add(t)
    db.commit()
    db.close()
    print("Добавил тестовые заявки:", len(samples))


if __name__ == "__main__":
    run()
