# простая авторизация админа через Basic Auth.
# креды по умолчанию admin:admin (как в тз)
import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"


def require_admin(credentials: HTTPBasicCredentials = Depends(security)):
    # compare_digest чтобы не сравнивать строки напрямую
    user_ok = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    pass_ok = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (user_ok and pass_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль админа",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
