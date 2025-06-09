from fastapi import APIRouter

from .routers.auth import auth_router
from .routers.booking import router as booking_router
from .routers.section import router as section_router
from .routers.classroom import router as classroom_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(booking_router)
api_router.include_router(section_router)
api_router.include_router(classroom_router)