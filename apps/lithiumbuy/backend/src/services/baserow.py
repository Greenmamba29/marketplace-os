"""Baserow API integration service."""

import logging
from typing import Any, Dict, List, Optional

import httpx

from src.config import settings

logger = logging.getLogger(__name__)


class BaserowService:
    """Service for interacting with Baserow API."""
    
    def __init__(self):
        self.base_url = settings.baserow_url.rstrip("/")
        self.token = settings.baserow_token
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to the Baserow API."""
        url = f"{self.base_url}/api/database/rows/table/{endpoint}"
        
        # Always use user_field_names for consistent field naming
        if params is None:
            params = {}
        params["user_field_names"] = "true"
        
        async with httpx.AsyncClient() as client:
            try:
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
            except httpx.HTTPStatusError as e:
                logger.error(f"Baserow API error: {e.response.status_code} - {e.response.text}")
                raise
            except Exception as e:
                logger.error(f"Baserow request failed: {e}")
                raise
    
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
    
    async def get_row(self, table_id: int, row_id: str) -> Dict[str, Any]:
        """Get a single row by ID."""
        return await self._request("GET", f"{table_id}/{row_id}/")
    
    async def create_row(
        self,
        table_id: int,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new row in a table."""
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
        """Delete a row from a table."""
        await self._request("DELETE", f"{table_id}/{row_id}/")
    
    # Convenience methods for specific tables
    
    async def get_users(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100,
    ) -> Dict[str, Any]:
        """Get users from the users table."""
        return await self.list_rows(settings.users_table_id, filters, page, size)
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email address."""
        result = await self.list_rows(
            settings.users_table_id,
            filters={"filter__field_email__equal": email},
            size=1,
        )
        items = result.get("results", [])
        return items[0] if items else None
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user."""
        return await self.create_row(settings.users_table_id, user_data)
    
    async def get_materials(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Get materials from the products table."""
        return await self.list_rows(settings.products_table_id, filters, page, size)
    
    async def get_material(self, material_id: str) -> Dict[str, Any]:
        """Get a single material by ID."""
        return await self.get_row(settings.products_table_id, material_id)
    
    async def get_mines(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 50,
    ) -> Dict[str, Any]:
        """Get mines from the mines table."""
        return await self.list_rows(settings.mines_table_id, filters, page, size)
    
    async def get_spot_prices(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 100,
    ) -> Dict[str, Any]:
        """Get spot prices from the spot prices table."""
        return await self.list_rows(settings.spot_prices_table_id, filters, page, size)
    
    async def create_spot_price(self, price_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new spot price record."""
        return await self.create_row(settings.spot_prices_table_id, price_data)
    
    async def get_rfqs(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Get RFQs from the RFQ table."""
        return await self.list_rows(settings.rfq_table_id, filters, page, size)
    
    async def create_rfq(self, rfq_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new RFQ."""
        return await self.create_row(settings.rfq_table_id, rfq_data)
    
    async def update_rfq(self, rfq_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an RFQ."""
        return await self.update_row(settings.rfq_table_id, rfq_id, data)
    
    async def get_quotes(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Get quotes from the quotes table."""
        return await self.list_rows(settings.quotes_table_id, filters, page, size)
    
    async def create_quote(self, quote_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new quote."""
        return await self.create_row(settings.quotes_table_id, quote_data)
    
    async def update_quote(self, quote_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a quote."""
        return await self.update_row(settings.quotes_table_id, quote_id, data)
    
    async def get_contracts(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Get contracts from the contracts table."""
        return await self.list_rows(settings.contracts_table_id, filters, page, size)
    
    async def create_contract(self, contract_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new contract."""
        return await self.create_row(settings.contracts_table_id, contract_data)
    
    async def update_contract(self, contract_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a contract."""
        return await self.update_row(settings.contracts_table_id, contract_id, data)
    
    async def get_orders(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Get orders from the orders table."""
        return await self.list_rows(settings.orders_table_id, filters, page, size)
    
    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new order."""
        return await self.create_row(settings.orders_table_id, order_data)
    
    async def get_alerts(
        self,
        filters: Optional[Dict] = None,
        page: int = 1,
        size: int = 50,
    ) -> Dict[str, Any]:
        """Get alerts from the alerts table."""
        return await self.list_rows(settings.alerts_table_id, filters, page, size)
    
    async def create_alert(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new alert."""
        return await self.create_row(settings.alerts_table_id, alert_data)


# Singleton instance
baserow_service = BaserowService()
