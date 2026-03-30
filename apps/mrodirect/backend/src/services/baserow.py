"""Baserow integration service."""

from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from config import get_settings


class BaserowError(Exception):
    """Baserow API error."""
    pass


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.BASEROW_URL.rstrip("/")
        self.token = self.settings.BASEROW_TOKEN
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    def _get_url(self, table_id: int, row_id: Optional[str] = None) -> str:
        """Build Baserow API URL."""
        url = f"{self.base_url}/api/database/rows/table/{table_id}/"
        if row_id:
            url += f"{row_id}/"
        return url + "?user_field_names=true"
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def list_rows(
        self,
        table_id: int,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table."""
        params: Dict[str, Any] = {
            "page": page,
            "size": size,
            "user_field_names": "true",
        }
        
        if filters:
            for key, value in filters.items():
                params[f"filter__{key}"] = value
        
        if order_by:
            params["order_by"] = order_by
        
        url = f"{self.base_url}/api/database/rows/table/{table_id}/?{urlencode(params)}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            
            if response.status_code != 200:
                raise BaserowError(f"Failed to list rows: {response.text}")
            
            return response.json()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def get_row(self, table_id: int, row_id: str) -> Dict[str, Any]:
        """Get a single row by ID."""
        url = self._get_url(table_id, row_id)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            
            if response.status_code == 404:
                raise BaserowError(f"Row {row_id} not found")
            
            if response.status_code != 200:
                raise BaserowError(f"Failed to get row: {response.text}")
            
            return response.json()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def create_row(self, table_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new row."""
        url = self._get_url(table_id)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=self.headers,
                json=data,
            )
            
            if response.status_code != 200:
                raise BaserowError(f"Failed to create row: {response.text}")
            
            return response.json()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def update_row(
        self,
        table_id: int,
        row_id: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing row."""
        url = self._get_url(table_id, row_id)
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                url,
                headers=self.headers,
                json=data,
            )
            
            if response.status_code == 404:
                raise BaserowError(f"Row {row_id} not found")
            
            if response.status_code != 200:
                raise BaserowError(f"Failed to update row: {response.text}")
            
            return response.json()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def delete_row(self, table_id: int, row_id: str) -> bool:
        """Delete a row."""
        url = self._get_url(table_id, row_id)
        
        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=self.headers)
            
            if response.status_code == 404:
                raise BaserowError(f"Row {row_id} not found")
            
            if response.status_code not in (200, 204):
                raise BaserowError(f"Failed to delete row: {response.text}")
            
            return True
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def search_rows(
        self,
        table_id: int,
        search: str,
        page: int = 1,
        size: int = 100,
    ) -> Dict[str, Any]:
        """Search rows in a table."""
        params = {
            "search": search,
            "page": page,
            "size": size,
            "user_field_names": "true",
        }
        
        url = f"{self.base_url}/api/database/rows/table/{table_id}/?{urlencode(params)}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            
            if response.status_code != 200:
                raise BaserowError(f"Failed to search rows: {response.text}")
            
            return response.json()
    
    # Convenience methods for specific tables
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        settings = get_settings()
        if not settings.BASEROW_USERS_TABLE_ID:
            return None
        
        result = await self.list_rows(
            settings.BASEROW_USERS_TABLE_ID,
            filters={"email": email},
            size=1,
        )
        
        results = result.get("results", [])
        return results[0] if results else None
    
    async def get_part_by_sku(self, sku: str) -> Optional[Dict[str, Any]]:
        """Get part by SKU."""
        settings = get_settings()
        if not settings.BASEROW_PARTS_TABLE_ID:
            return None
        
        result = await self.list_rows(
            settings.BASEROW_PARTS_TABLE_ID,
            filters={"sku": sku},
            size=1,
        )
        
        results = result.get("results", [])
        return results[0] if results else None
    
    async def get_parts_by_machine(self, machine_id: str) -> List[Dict[str, Any]]:
        """Get parts compatible with a machine."""
        settings = get_settings()
        if not settings.BASEROW_PARTS_TABLE_ID:
            return []
        
        result = await self.list_rows(
            settings.BASEROW_PARTS_TABLE_ID,
            filters={"compatible_machines__contains": machine_id},
        )
        
        return result.get("results", [])
