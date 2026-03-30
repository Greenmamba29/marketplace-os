from fastapi import APIRouter, Depends
from models.order import Order, OrderCreate
from models.common import APIResponse

router = APIRouter()

@router.post("", response_model=APIResponse[Order])
async def create_order(order_data: OrderCreate):
    return APIResponse.success_response(None)
