from fastapi import APIRouter, Depends
from models.quote import Quote, QuoteCreate
from models.common import APIResponse

router = APIRouter()

@router.post("", response_model=APIResponse[Quote])
async def create_quote(quote_data: QuoteCreate):
    return APIResponse.success_response(None)
