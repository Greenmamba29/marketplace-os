"""
Baserow Integration Service for GovSource Backend
"""

import httpx
from typing import Optional, List, Dict, Any
from functools import lru_cache
from tenacity import retry, stop_after_attempt, wait_exponential
import structlog

from ..config import get_settings

logger = structlog.get_logger()


class BaserowError(Exception):
    """Baserow API error."""
    pass


class BaserowService:
    """Service for interacting with Baserow API."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.baserow_url.rstrip('/')
        self.token = self.settings.baserow_token
        self.database_id = self.settings.baserow_database_id
        
        if not self.token:
            logger.warning("BASEROW_TOKEN not set")
        
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                headers={
                    "Authorization": f"Token {self.token}",
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )
        return self._client
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self, 
        method: str, 
        endpoint: str, 
        **kwargs
    ) -> Dict[str, Any]:
        """Make a request to Baserow API."""
        client = await self._get_client()
        url = f"{self.base_url}/api{endpoint}"
        
        # Always use user_field_names=true
        if "params" not in kwargs:
            kwargs["params"] = {}
        kwargs["params"]["user_field_names"] = "true"
        
        try:
            response = await client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(
                "Baserow API error",
                status_code=e.response.status_code,
                response=e.response.text,
                endpoint=endpoint,
            )
            raise BaserowError(f"Baserow API error: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            logger.error("Baserow request failed", error=str(e), endpoint=endpoint)
            raise BaserowError(f"Request failed: {str(e)}")
    
    async def list_rows(
        self, 
        table_id: int, 
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100
    ) -> List[Dict[str, Any]]:
        """List rows from a table."""
        params = {"page": page, "size": size}
        if filters:
            params.update(filters)
        
        result = await self._request("GET", f"/database/rows/table/{table_id}/", params=params)
        return result.get("results", [])
    
    async def get_row(self, table_id: int, row_id: int) -> Dict[str, Any]:
        """Get a single row by ID."""
        return await self._request("GET", f"/database/rows/table/{table_id}/{row_id}/")
    
    async def create_row(
        self, 
        table_id: int, 
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new row."""
        return await self._request(
            "POST", 
            f"/database/rows/table/{table_id}/", 
            json=data
        )
    
    async def update_row(
        self, 
        table_id: int, 
        row_id: int, 
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing row."""
        return await self._request(
            "PATCH", 
            f"/database/rows/table/{table_id}/{row_id}/", 
            json=data
        )
    
    async def delete_row(self, table_id: int, row_id: int) -> None:
        """Delete a row."""
        await self._request("DELETE", f"/database/rows/table/{table_id}/{row_id}/")
    
    async def search_rows(
        self, 
        table_id: int, 
        search: str,
        filters: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Search rows in a table."""
        params = {"search": search}
        if filters:
            params.update(filters)
        
        result = await self._request("GET", f"/database/rows/table/{table_id}/", params=params)
        return result.get("results", [])
    
    async def get_tables(self) -> List[Dict[str, Any]]:
        """Get all tables in the database."""
        result = await self._request("GET", f"/database/tables/database/{self.database_id}/")
        return result
    
    async def get_table_fields(self, table_id: int) -> List[Dict[str, Any]]:
        """Get fields for a table."""
        result = await self._request("GET", f"/database/fields/table/{table_id}/")
        return result
    
    async def close(self):
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()


# Table IDs (these would be configured based on your Baserow setup)
class BaserowTables:
    """Baserow table IDs."""
    USERS = 0
    VENDORS = 0
    VENDOR_QUALIFICATIONS = 0
    RFP_REGISTRY = 0
    RFQ_SUBMISSIONS = 0
    QUOTES = 0
    ORDERS = 0
    FAR_COMPLIANCE = 0
    DFARS_COMPLIANCE = 0
    SET_ASIDE_TRACKING = 0
    COMPLIANCE_RECORDS = 0
    AUDIT_LOG = 0


@lru_cache()
def get_baserow_service() -> BaserowService:
    """Get cached Baserow service instance."""
    return BaserowService()
