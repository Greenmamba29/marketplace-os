"""
Baserow Integration Service for LabSource

All Baserow API calls use user_field_names=true for human-readable field names.
"""

import json
import logging
from typing import Any, Dict, List, Optional, TypeVar, Generic
from functools import lru_cache

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings, BASEROW_TABLES

logger = logging.getLogger(__name__)

T = TypeVar("T")


class BaserowError(Exception):
    """Baserow API error."""
    pass


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.baserow_url.rstrip("/")
        self.token = self.settings.baserow_token
        self.database_id = self.settings.baserow_database_id
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Token {self.token}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make an HTTP request to Baserow API."""
        try:
            response = await self.client.request(
                method=method,
                url=endpoint,
                params=params,
                json=json_data,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Baserow API error: {e.response.status_code} - {e.response.text}")
            raise BaserowError(f"Baserow API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Baserow request error: {e}")
            raise BaserowError(f"Request failed: {e}")
    
    async def list_rows(
        self,
        table_id: str,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a Baserow table."""
        params = {
            "user_field_names": "true",
            "page": page,
            "size": size,
        }
        if filters:
            params["filters"] = json.dumps(filters)
        if order_by:
            params["order_by"] = order_by
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{table_id}/",
            params=params,
        )
    
    async def get_row(self, table_id: str, row_id: str) -> Dict[str, Any]:
        """Get a single row from a Baserow table."""
        return await self._request(
            "GET",
            f"/api/database/rows/table/{table_id}/{row_id}/",
            params={"user_field_names": "true"},
        )
    
    async def create_row(
        self,
        table_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row in a Baserow table."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{table_id}/",
            params={"user_field_names": "true"},
            json_data=data,
        )
    
    async def update_row(
        self,
        table_id: str,
        row_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row in a Baserow table."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{table_id}/{row_id}/",
            params={"user_field_names": "true"},
            json_data=data,
        )
    
    async def delete_row(self, table_id: str, row_id: str) -> None:
        """Delete a row from a Baserow table."""
        await self._request(
            "DELETE",
            f"/api/database/rows/table/{table_id}/{row_id}/",
        )
    
    # Convenience methods for specific tables
    
    async def get_users(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get users from Baserow."""
        result = await self.list_rows(BASEROW_TABLES["users"], filters=filters)
        return result.get("results", [])
    
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get a user by email address."""
        filters = {"filter_type": "AND", "filters": [{"field": "email", "type": "equal", "value": email}]}
        result = await self.list_rows(BASEROW_TABLES["users"], filters=filters)
        results = result.get("results", [])
        return results[0] if results else None
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in Baserow."""
        return await self.create_row(BASEROW_TABLES["users"], user_data)
    
    async def get_products(self, filters: Optional[Dict] = None, page: int = 1) -> Dict[str, Any]:
        """Get products from Baserow."""
        return await self.list_rows(BASEROW_TABLES["products"], filters=filters, page=page)
    
    async def get_product(self, product_id: str) -> Dict[str, Any]:
        """Get a single product from Baserow."""
        return await self.get_row(BASEROW_TABLES["products"], product_id)
    
    async def get_lots(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get lots from Baserow."""
        result = await self.list_rows(BASEROW_TABLES["lots"], filters=filters)
        return result.get("results", [])
    
    async def get_lot(self, lot_id: str) -> Dict[str, Any]:
        """Get a single lot from Baserow."""
        return await self.get_row(BASEROW_TABLES["lots"], lot_id)
    
    async def update_lot(self, lot_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a lot in Baserow."""
        return await self.update_row(BASEROW_TABLES["lots"], lot_id, data)
    
    async def get_rfq_submissions(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get RFQ submissions from Baserow."""
        result = await self.list_rows(BASEROW_TABLES["rfq_submissions"], filters=filters)
        return result.get("results", [])
    
    async def create_rfq(self, rfq_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new RFQ in Baserow."""
        return await self.create_row(BASEROW_TABLES["rfq_submissions"], rfq_data)
    
    async def get_cold_chain_logs(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get cold chain compliance logs from Baserow."""
        result = await self.list_rows(BASEROW_TABLES["cold_chain_compliance"], filters=filters)
        return result.get("results", [])
    
    async def create_cold_chain_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a cold chain log entry in Baserow."""
        return await self.create_row(BASEROW_TABLES["cold_chain_compliance"], log_data)
    
    async def get_clia_products(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get CLIA products from Baserow."""
        result = await self.list_rows(BASEROW_TABLES["clia_registry"], filters=filters)
        return result.get("results", [])
    
    async def create_audit_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an audit log entry in Baserow."""
        return await self.create_row(BASEROW_TABLES["audit_log"], log_data)


@lru_cache()
def get_baserow_service() -> BaserowService:
    """Get cached Baserow service instance."""
    return BaserowService()
