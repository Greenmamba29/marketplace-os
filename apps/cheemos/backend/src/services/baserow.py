"""Baserow service for database operations."""

from typing import Any, Dict, List, Optional

import httpx

from src.config import BASEROW_TABLES, get_settings


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.BASEROW_API_URL
        self.token = self.settings.BASEROW_TOKEN
        self.tables = BASEROW_TABLES
        
    def _get_headers(self) -> Dict[str, str]:
        """Get request headers with authorization."""
        return {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    async def list_rows(
        self,
        table_name: str,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        params = {
            "user_field_names": "true",
            "page": page,
            "size": size,
        }
        
        if filters:
            for key, value in filters.items():
                params[f"filter__{key}"] = value
        
        if order_by:
            params["order_by"] = order_by
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/database/rows/table/{table_id}/",
                headers=self._get_headers(),
                params=params,
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    
    async def get_row(self, table_name: str, row_id: str) -> Dict[str, Any]:
        """Get a single row by ID."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/database/rows/table/{table_id}/{row_id}/",
                headers=self._get_headers(),
                params={"user_field_names": "true"},
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    
    async def create_row(
        self,
        table_name: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/database/rows/table/{table_id}/",
                headers=self._get_headers(),
                params={"user_field_names": "true"},
                json=data,
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    
    async def update_row(
        self,
        table_name: str,
        row_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{self.base_url}/api/database/rows/table/{table_id}/{row_id}/",
                headers=self._get_headers(),
                params={"user_field_names": "true"},
                json=data,
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    
    async def delete_row(self, table_name: str, row_id: str) -> None:
        """Delete a row."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/api/database/rows/table/{table_id}/{row_id}/",
                headers=self._get_headers(),
                timeout=30.0,
            )
            response.raise_for_status()
    
    async def search_rows(
        self,
        table_name: str,
        query: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Search rows in a table."""
        table_id = self.tables.get(table_name.upper())
        if not table_id:
            raise ValueError(f"Unknown table: {table_name}")
        
        params = {
            "user_field_names": "true",
            "search": query,
            "size": limit,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/database/rows/table/{table_id}/",
                headers=self._get_headers(),
                params=params,
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])


# Singleton instance
_baserow_service: Optional[BaserowService] = None


def get_baserow_service() -> BaserowService:
    """Get or create Baserow service singleton."""
    global _baserow_service
    if _baserow_service is None:
        _baserow_service = BaserowService()
    return _baserow_service
