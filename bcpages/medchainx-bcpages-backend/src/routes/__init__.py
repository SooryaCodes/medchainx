from fastapi import APIRouter
from .auth import router as auth_router
from .records import router as records_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(records_router, prefix="/records", tags=["records"])