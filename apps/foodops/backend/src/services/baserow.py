"""Baserow integration service."""

import httpx
from typing import Any, Dict, List, Optional

from ..config import settings


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.base_url = settings.BASEROW_URL
        self.token = settings.BASEROW_API_TOKEN
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to the Baserow API."""
        url = f"{self.base_url}/api/database/rows/table/{endpoint}"
        
        # Always use user_field_names for readable responses
        if params is None:
            params = {}
        params["user_field_names"] = "true"
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=url,
                headers=self.headers,
                params=params,
                json=data,
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    
    async def list_rows(
        self,
        table_id: int,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table."""
        params = {
            "page": page,
            "size": size,
        }
        if filters:
            params.update(filters)
        if order_by:
            params["order_by"] = order_by
        
        return await self._request("GET", f"{table_id}/", params=params)
    
    async def get_row(self, table_id: int, row_id: int) -> Dict[str, Any]:
        """Get a single row by ID."""
        return await self._request("GET", f"{table_id}/{row_id}/")
    
    async def create_row(self, table_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new row."""
        return await self._request("POST", f"{table_id}/", data=data)
    
    async def update_row(
        self,
        table_id: int,
        row_id: int,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row."""
        return await self._request("PATCH", f"{table_id}/{row_id}/", data=data)
    
    async def delete_row(self, table_id: int, row_id: int) -> None:
        """Delete a row."""
        await self._request("DELETE", f"{table_id}/{row_id}/")
    
    # Convenience methods for specific tables
    
    async def get_users(self, **kwargs) -> Dict[str, Any]:
        """Get users from the users table."""
        if not settings.BASEROW_USERS_TABLE_ID:
            raise ValueError("BASEROW_USERS_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_USERS_TABLE_ID, **kwargs)
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email address."""
        if not settings.BASEROW_USERS_TABLE_ID:
            raise ValueError("BASEROW_USERS_TABLE_ID not configured")
        
        result = await self.list_rows(
            settings.BASEROW_USERS_TABLE_ID,
            filters={"filter__field_email__equal": email},
        )
        results = result.get("results", [])
        return results[0] if results else None
    
    async def get_ingredients(self, **kwargs) -> Dict[str, Any]:
        """Get ingredients from the products table."""
        if not settings.BASEROW_PRODUCTS_TABLE_ID:
            raise ValueError("BASEROW_PRODUCTS_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_PRODUCTS_TABLE_ID, **kwargs)
    
    async def get_ingredient(self, ingredient_id: str) -> Optional[Dict[str, Any]]:
        """Get a single ingredient by ID."""
        if not settings.BASEROW_PRODUCTS_TABLE_ID:
            raise ValueError("BASEROW_PRODUCTS_TABLE_ID not configured")
        
        result = await self.list_rows(
            settings.BASEROW_PRODUCTS_TABLE_ID,
            filters={"filter__field_id__equal": ingredient_id},
        )
        results = result.get("results", [])
        return results[0] if results else None
    
    async def create_ingredient(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new ingredient."""
        if not settings.BASEROW_PRODUCTS_TABLE_ID:
            raise ValueError("BASEROW_PRODUCTS_TABLE_ID not configured")
        return await self.create_row(settings.BASEROW_PRODUCTS_TABLE_ID, data)
    
    async def get_lots(self, **kwargs) -> Dict[str, Any]:
        """Get lot records from the lot tracking table."""
        if not settings.BASEROW_LOT_TRACKING_TABLE_ID:
            raise ValueError("BASEROW_LOT_TRACKING_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_LOT_TRACKING_TABLE_ID, **kwargs)
    
    async def create_lot(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new lot record."""
        if not settings.BASEROW_LOT_TRACKING_TABLE_ID:
            raise ValueError("BASEROW_LOT_TRACKING_TABLE_ID not configured")
        return await self.create_row(settings.BASEROW_LOT_TRACKING_TABLE_ID, data)
    
    async def get_temperature_logs(self, **kwargs) -> Dict[str, Any]:
        """Get temperature logs."""
        if not settings.BASEROW_TEMPERATURE_LOGS_TABLE_ID:
            raise ValueError("BASEROW_TEMPERATURE_LOGS_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_TEMPERATURE_LOGS_TABLE_ID, **kwargs)
    
    async def create_temperature_log(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new temperature log entry."""
        if not settings.BASEROW_TEMPERATURE_LOGS_TABLE_ID:
            raise ValueError("BASEROW_TEMPERATURE_LOGS_TABLE_ID not configured")
        return await self.create_row(settings.BASEROW_TEMPERATURE_LOGS_TABLE_ID, data)
    
    async def get_rfq(self, **kwargs) -> Dict[str, Any]:
        """Get RFQs."""
        if not settings.BASEROW_RFQ_TABLE_ID:
            raise ValueError("BASEROW_RFQ_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_RFQ_TABLE_ID, **kwargs)
    
    async def create_rfq(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new RFQ."""
        if not settings.BASEROW_RFQ_TABLE_ID:
            raise ValueError("BASEROW_RFQ_TABLE_ID not configured")
        return await self.create_row(settings.BASEROW_RFQ_TABLE_ID, data)
    
    async def get_orders(self, **kwargs) -> Dict[str, Any]:
        """Get orders."""
        if not settings.BASEROW_ORDERS_TABLE_ID:
            raise ValueError("BASEROW_ORDERS_TABLE_ID not configured")
        return await self.list_rows(settings.BASEROW_ORDERS_TABLE_ID, **kwargs)
    
    async def create_order(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new order."""
        if not settings.BASEROW_ORDERS_TABLE_ID:
            raise ValueError("BASEROW_ORDERS_TABLE_ID not configured")
        return await self.create_row(settings.BASEROW_ORDERS_TABLE_ID, data)


# Global service instance
baserow_service = BaserowService()
