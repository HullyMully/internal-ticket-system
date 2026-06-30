# тут настройка базы. база sqlite, лежит файлом рядом
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./tickets.db"

# check_same_thread нужно для sqlite, иначе ругается на потоки
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# отдаём сессию в ручки через Depends
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
