"""Baserow integration service."""

import logging
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings

logger = logging.getLogger(__name__)


class BaserowService:
    """Service for interacting with Baserow database."""
    
    # Table IDs (would be configured based on actual Baserow setup)
    TABLES = {
        "users": 0,
        "suppliers": 0,
        "products": 0,
        "projects": 0,
        "project_materials": 0,
        "rfq_submissions": 0,
        "rfq_items": 0,
        "quotes": 0,
        "quote_items": 0,
        "orders": 0,
        "order_items": 0,
        "regional_availability": 0,
        "spec_sheets": 0,
        "leed_tracking": 0,
        "accio_requests": 0,
    }
    
    def __init__(self) -> None:
        """Initialize Baserow service."""
        self.base_url = settings.BASEROW_URL.rstrip("/")
        self.api_key = settings.BASEROW_API_KEY
        self.database_id = settings.BASEROW_DATABASE_ID
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Token {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def _request(
        self,
        method: str,
        endpoint: str,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Make a request to Baserow API."""
        url = f"/api/database/rows/table/{endpoint}"
        
        # Always use user_field_names for better readability
        if "params" not in kwargs:
            kwargs["params"] = {}
        kwargs["params"]["user_field_names"] = "true"
        
        try:
            response = await self.client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Baserow API error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Baserow request failed: {e}")
            raise
    
    async def list_rows(
        self,
        table_name: str,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table."""
        table_id = self.TABLES.get(table_name)
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        params: Dict[str, Any] = {
            "page": page,
            "size": size,
        }
        
        if filters:
            for key, value in filters.items():
                params[f"filter__{key}"] = value
        
        if order_by:
            params["order_by"] = order_by
        
        return await self._request("GET", str(table_id), params=params)
    
    async def get_row(
        self,
        table_name: str,
        row_id: str,
    ) -> Dict[str, Any]:
        """Get a single row by ID."""
        table_id = self.TABLES.get(table_name)
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        return await self._request("GET", f"{table_id}/{row_id}/")
    
    async def create_row(
        self,
        table_name: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row."""
        table_id = self.TABLES.get(table_name)
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        return await self._request("POST", str(table_id), json=data)
    
    async def update_row(
        self,
        table_name: str,
        row_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row."""
        table_id = self.TABLES.get(table_name)
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        return await self._request("PATCH", f"{table_id}/{row_id}/", json=data)
    
    async def delete_row(
        self,
        table_name: str,
        row_id: str,
    ) -> None:
        """Delete a row."""
        table_id = self.TABLES.get(table_name)
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        await self._request("DELETE", f"{table_id}/{row_id}/")
    
    # User operations
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        result = await self.list_rows(
            "users",
            filters={"email": email},
            size=1,
        )
        rows = result.get("results", [])
        return rows[0] if rows else None
    
    # Material operations
    async def search_materials(
        self,
        search: Optional[str] = None,
        material_type: Optional[str] = None,
        min_recycled: Optional[float] = None,
        leed_eligible: Optional[bool] = None,
        page: int = 1,
        size: int = 24,
    ) -> Dict[str, Any]:
        """Search materials with filters."""
        filters: Dict[str, Any] = {}
        
        if material_type:
            filters["material_type"] = material_type
        if min_recycled is not None:
            filters["recycled_content_percent__gte"] = min_recycled
        if leed_eligible:
            filters["leed_points__gt"] = 0
        
        return await self.list_rows(
            "products",
            filters=filters if filters else None,
            page=page,
            size=size,
        )
    
    # Regional availability
    async def get_regional_availability(
        self,
        material_id: str,
        zip_code: str,
        radius_miles: int = 50,
    ) -> List[Dict[str, Any]]:
        """Get regional availability for a material."""
        # This would use a more sophisticated geospatial query in production
        result = await self.list_rows(
            "regional_availability",
            filters={
                "material_id": material_id,
                "zip_code": zip_code,
            },
        )
        return result.get("results", [])
    
    # Project operations
    async def get_project_materials(self, project_id: str) -> List[Dict[str, Any]]:
        """Get materials for a project."""
        result = await self.list_rows(
            "project_materials",
            filters={"project_id": project_id},
        )
        return result.get("results", [])
    
    # RFQ operations
    async def get_rfq_with_items(self, rfq_id: str) -> Dict[str, Any]:
        """Get RFQ with its items."""
        rfq = await self.get_row("rfq_submissions", rfq_id)
        items_result = await self.list_rows(
            "rfq_items",
            filters={"rfq_id": rfq_id},
        )
        rfq["items"] = items_result.get("results", [])
        return rfq
    
    async def close(self) -> None:
        """Close the HTTP client."""
        await self.client.aclose()


# Singleton instance
_baserow_service: Optional[BaserowService] = None


def get_baserow_service() -> BaserowService:
    """Get or create Baserow service instance."""
    global _baserow_service
    if _baserow_service is None:
        _baserow_service = BaserowService()
    return _baserow_service
