from fastapi import APIRouter
router = APIRouter()
@router.post("/{listing_id}/bid")
async def place_bid(listing_id: str, amount: float):
    return {"success": True}
