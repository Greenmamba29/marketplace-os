from fastapi import APIRouter, Depends
from models.rfq import RFQSubmission, RFQCreate
from models.common import APIResponse

router = APIRouter()

@router.post("", response_model=APIResponse[RFQSubmission])
async def create_rfq(rfq_data: RFQCreate):
    return APIResponse.success_response(None)
