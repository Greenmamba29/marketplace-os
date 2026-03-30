"""Baserow API integration service."""

import json
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import settings

logger = structlog.get_logger()


class BaserowError(Exception):
    """Baserow API error."""
    
    def __init__(self, message: str, status_code: int = None, response: dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response


class BaserowService:
    """Service for interacting with Baserow API."""
    
    def __init__(self):
        self.base_url = settings.baserow_api_url.rstrip("/")
        self.api_key = settings.baserow_api_key
        self.headers = {
            "Authorization": f"Token {self.api_key}",
            "Content-Type": "application/json",
        }
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=self.headers,
            timeout=30.0,
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to the Baserow API."""
        # Always use user_field_names=true for consistency
        if params is None:
            params = {}
        params["user_field_names"] = "true"
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            logger.debug(
                "baserow_request",
                method=method,
                endpoint=endpoint,
                params=params,
            )
            
            response = await self.client.request(
                method=method,
                url=url,
                params=params,
                json=data,
            )
            
            response.raise_for_status()
            result = response.json()
            
            logger.debug(
                "baserow_response",
                method=method,
                endpoint=endpoint,
                status_code=response.status_code,
            )
            
            return result
            
        except httpx.HTTPStatusError as e:
            logger.error(
                "baserow_http_error",
                method=method,
                endpoint=endpoint,
                status_code=e.response.status_code,
                response=e.response.text,
            )
            raise BaserowError(
                f"Baserow API error: {e.response.status_code}",
                status_code=e.response.status_code,
                response=e.response.json() if e.response.text else None,
            )
            
        except httpx.RequestError as e:
            logger.error(
                "baserow_request_error",
                method=method,
                endpoint=endpoint,
                error=str(e),
            )
            raise BaserowError(f"Request failed: {str(e)}")
    
    # Table Operations
    
    async def list_rows(
        self,
        table_id: int,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table."""
        params = {"page": page, "size": size}
        
        if filters:
            params.update(filters)
        if order_by:
            params["order_by"] = order_by
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{table_id}/",
            params=params,
        )
    
    async def get_row(self, table_id: int, row_id: int) -> Dict[str, Any]:
        """Get a single row by ID."""
        return await self._request(
            "GET",
            f"/api/database/rows/table/{table_id}/{row_id}/",
        )
    
    async def create_row(
        self,
        table_id: int,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{table_id}/",
            data=data,
        )
    
    async def update_row(
        self,
        table_id: int,
        row_id: int,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{table_id}/{row_id}/",
            data=data,
        )
    
    async def delete_row(self, table_id: int, row_id: int) -> None:
        """Delete a row."""
        await self._request(
            "DELETE",
            f"/api/database/rows/table/{table_id}/{row_id}/",
        )
    
    # Search Operations
    
    async def search_rows(
        self,
        table_id: int,
        query: str,
        filters: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Search rows in a table."""
        params = {"search": query}
        if filters:
            params.update(filters)
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{table_id}/",
            params=params,
        )
    
    # Database Operations
    
    async def list_tables(self, database_id: int) -> List[Dict[str, Any]]:
        """List all tables in a database."""
        result = await self._request(
            "GET",
            f"/api/database/tables/database/{database_id}/",
        )
        return result.get("tables", [])
    
    async def get_table_fields(self, table_id: int) -> List[Dict[str, Any]]:
        """Get all fields for a table."""
        result = await self._request(
            "GET",
            f"/api/database/fields/table/{table_id}/",
        )
        return result


# Singleton instance
_baserow_service: Optional[BaserowService] = None


def get_baserow_service() -> BaserowService:
    """Get or create Baserow service instance."""
    global _baserow_service
    if _baserow_service is None:
        _baserow_service = BaserowService()
    return _baserow_service
