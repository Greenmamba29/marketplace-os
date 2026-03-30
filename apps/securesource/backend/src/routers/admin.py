from fastapi import APIRouter
router = APIRouter()
@router.get("/stats")
async def get_stats():
    return {"users": 0, "orders": 0}
