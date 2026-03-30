from fastapi import APIRouter, Depends, Query
from typing import List
from models.common import APIResponse, PaginatedResponse
from models.uniform_product import UniformProduct

router = APIRouter()

@router.get("", response_model=APIResponse[PaginatedResponse[UniformProduct]])
async def list_items(page: int = 1, page_size: int = 20):
    return APIResponse.success_response(PaginatedResponse.create(items=[], total=0, page=page, page_size=page_size))

@router.get("/{item_id}", response_model=APIResponse[UniformProduct])
async def get_item(item_id: str):
    return APIResponse.success_response(None)
