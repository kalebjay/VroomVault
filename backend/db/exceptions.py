from fastapi import HTTPException, status


def not_found_exception(name: str, identifier: int | str):
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{name} with id '{identifier}' not found"
    )


def user_not_found_exception(identifier: str | int):
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"User with identifier '{identifier}' not found"
    )


def forbidden_exception(detail: str = "Not authorized to perform this action"):
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def credentials_exception(detail: str = "Could not validate credentials"):
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )