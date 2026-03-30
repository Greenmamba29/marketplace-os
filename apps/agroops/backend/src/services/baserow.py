"""Baserow integration service."""

import logging
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import get_settings

logger = logging.getLogger(__name__)


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.BASEROW_URL
        self.token = self.settings.BASEROW_TOKEN
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to Baserow API."""
        url = f"{self.base_url}/api/database/rows/table/{endpoint}"
        
        # Always include user_field_names=true
        if params is None:
            params = {}
        params["user_field_names"] = "true"
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=url,
                headers=self.headers,
                params=params,
                json=json_data,
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
        
        return await self._request("GET", f"{table_id}/", params)
    
    async def get_row(self, table_id: int, row_id: str) -> Dict[str, Any]:
        """Get a single row by ID."""
        return await self._request("GET", f"{table_id}/{row_id}/")
    
    async def create_row(
        self,
        table_id: int,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row."""
        return await self._request("POST", f"{table_id}/", json_data=data)
    
    async def update_row(
        self,
        table_id: int,
        row_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row."""
        return await self._request("PATCH", f"{table_id}/{row_id}/", json_data=data)
    
    async def delete_row(self, table_id: int, row_id: str) -> None:
        """Delete a row."""
        await self._request("DELETE", f"{table_id}/{row_id}/")
    
    # User operations
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email."""
        settings = get_settings()
        # Assuming users table ID is configured
        users_table_id = 0  # Replace with actual table ID
        
        result = await self.list_rows(
            users_table_id,
            filters={"filter__field_email__equal": email},
            size=1,
        )
        
        if result.get("results"):
            return result["results"][0]
        return None
    
    async def create_user(self, user_data: Dict) -> Dict:
        """Create a new user."""
        settings = get_settings()
        users_table_id = 0  # Replace with actual table ID
        return await self.create_row(users_table_id, user_data)
    
    # Product operations
    async def get_products(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict:
        """Get products with optional filters."""
        settings = get_settings()
        products_table_id = 0  # Replace with actual table ID
        return await self.list_rows(products_table_id, filters, page, size)
    
    async def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Get product by ID."""
        settings = get_settings()
        products_table_id = 0  # Replace with actual table ID
        try:
            return await self.get_row(products_table_id, product_id)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    # RFQ operations
    async def create_rfq(self, rfq_data: Dict) -> Dict:
        """Create a new RFQ."""
        settings = get_settings()
        rfq_table_id = 0  # Replace with actual table ID
        return await self.create_row(rfq_table_id, rfq_data)
    
    async def get_rfq_by_id(self, rfq_id: str) -> Optional[Dict]:
        """Get RFQ by ID."""
        settings = get_settings()
        rfq_table_id = 0  # Replace with actual table ID
        try:
            return await self.get_row(rfq_table_id, rfq_id)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def update_rfq(self, rfq_id: str, data: Dict) -> Dict:
        """Update an RFQ."""
        settings = get_settings()
        rfq_table_id = 0  # Replace with actual table ID
        return await self.update_row(rfq_table_id, rfq_id, data)
    
    async def list_rfqs(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict:
        """List RFQs."""
        settings = get_settings()
        rfq_table_id = 0  # Replace with actual table ID
        return await self.list_rows(rfq_table_id, filters, page, size)
    
    # EPA Registration operations
    async def get_epa_registration(self, epa_number: str) -> Optional[Dict]:
        """Get EPA registration by number."""
        settings = get_settings()
        epa_table_id = 0  # Replace with actual table ID
        
        result = await self.list_rows(
            epa_table_id,
            filters={"filter__field_epa_number__equal": epa_number},
            size=1,
        )
        
        if result.get("results"):
            return result["results"][0]
        return None
    
    async def check_state_registration(
        self,
        epa_number: str,
        state: str,
    ) -> Optional[Dict]:
        """Check state registration status."""
        registration = await self.get_epa_registration(epa_number)
        if not registration:
            return None
        
        state_regs = registration.get("state_registrations", [])
        for reg in state_regs:
            if reg.get("state") == state:
                return reg
        
        return {"state": state, "status": "not_registered"}
