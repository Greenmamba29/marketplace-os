"""Baserow integration service."""

from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

import httpx
import structlog

from ..config import get_settings, BASEROW_TABLES

logger = structlog.get_logger()


class BaserowService:
    """Service for interacting with Baserow database."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.baserow_url.rstrip("/")
        self.token = self.settings.baserow_token
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
    
    def _get_table_url(self, table_name: str) -> str:
        """Get API URL for a table."""
        table_id = BASEROW_TABLES.get(table_name, table_name)
        return f"{self.base_url}/api/database/rows/table/{table_id}/"
    
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make HTTP request to Baserow API."""
        url = f"{self.base_url}{endpoint}"
        
        # Always use user_field_names for consistency
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
                logger.error(
                    "baserow_request_failed",
                    method=method,
                    url=url,
                    status_code=e.response.status_code,
                    response=e.response.text,
                )
                raise
            except Exception as e:
                logger.error(
                    "baserow_request_error",
                    method=method,
                    url=url,
                    error=str(e),
                )
                raise
    
    # User operations
    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID."""
        try:
            result = await self._request("GET", f"/api/database/rows/table/{BASEROW_TABLES['users']}/{user_id}/")
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['users']}/",
            params={"search": email, "search_field": "email"},
        )
        results = result.get("results", [])
        return results[0] if results else None
    
    async def create_user(self, user_data: Dict) -> Dict:
        """Create a new user."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{BASEROW_TABLES['users']}/",
            json_data=user_data,
        )
    
    async def update_user(self, user_id: str, updates: Dict) -> Dict:
        """Update a user."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['users']}/{user_id}/",
            json_data=updates,
        )
    
    async def list_users(self, page: int = 1, per_page: int = 20) -> Dict:
        """List users."""
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['users']}/",
            params={"page": page, "size": per_page},
        )
    
    async def count_users(self) -> int:
        """Count total users."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['users']}/",
            params={"size": 1},
        )
        return result.get("count", 0)
    
    # Equipment operations
    async def get_equipment_by_id(self, equipment_id: str) -> Optional[Dict]:
        """Get equipment by ID."""
        try:
            result = await self._request(
                "GET",
                f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/{equipment_id}/",
            )
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def list_equipment(
        self,
        page: int = 1,
        per_page: int = 20,
        filters: Optional[Dict] = None,
    ) -> Dict:
        """List equipment with filters."""
        params = {"page": page, "size": per_page}
        
        if filters:
            # Build filter string for Baserow
            filter_parts = []
            for key, value in filters.items():
                if value is not None:
                    filter_parts.append(f"{key}={value}")
            if filter_parts:
                params["search"] = " ".join(filter_parts)
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/",
            params=params,
        )
    
    async def search_equipment(self, query: str, filters: Optional[Dict] = None) -> List[Dict]:
        """Search equipment."""
        params = {"search": query}
        
        if filters:
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}"] = value
        
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/",
            params=params,
        )
        return result.get("results", [])
    
    async def get_equipment_by_category(self, category_id: str) -> List[Dict]:
        """Get equipment by category."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/",
            params={"filter__category_id": category_id},
        )
        return result.get("results", [])
    
    async def create_equipment(self, equipment_data: Dict) -> Dict:
        """Create new equipment."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/",
            json_data=equipment_data,
        )
    
    async def update_equipment(self, equipment_id: str, updates: Dict) -> Dict:
        """Update equipment."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/{equipment_id}/",
            json_data=updates,
        )
    
    async def count_equipment(self) -> int:
        """Count total equipment."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['equipment']}/",
            params={"size": 1},
        )
        return result.get("count", 0)
    
    # UDI operations
    async def get_udi_tracking_info(self, udi: str) -> Optional[Dict]:
        """Get UDI tracking information."""
        # Search for UDI in orders or equipment
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/",
            params={"search": udi},
        )
        
        # Mock response for now
        return {
            "udi": udi,
            "device_name": "Patient Monitor MX450",
            "manufacturer": "Philips",
            "catalog_number": "MX450-US",
            "device_class": "II",
            "current_location": "ICU Room 12",
            "last_updated": "2024-01-15T10:30:00Z",
        }
    
    async def get_udi_movement_history(self, udi: str) -> List[Dict]:
        """Get UDI movement history."""
        # Mock data
        return [
            {
                "timestamp": "2024-01-10T08:00:00Z",
                "from_location": "Central Supply",
                "to_location": "ICU Room 12",
                "performed_by": "John Smith",
                "reason": "Patient admission",
            },
            {
                "timestamp": "2024-01-05T14:30:00Z",
                "from_location": "Receiving Dock",
                "to_location": "Central Supply",
                "performed_by": "Jane Doe",
                "reason": "Order receipt",
            },
        ]
    
    async def record_udi_movement(
        self,
        udi: str,
        from_location: str,
        to_location: str,
        reason: str,
        performed_by: str,
    ) -> Dict:
        """Record UDI movement."""
        movement_data = {
            "udi": udi,
            "from_location": from_location,
            "to_location": to_location,
            "reason": reason,
            "performed_by": performed_by,
        }
        
        # In real implementation, save to audit log or UDI tracking table
        logger.info("udi_movement_recorded", **movement_data)
        
        return movement_data
    
    async def get_order_udis(self, order_id: str) -> List[Dict]:
        """Get all UDIs for an order."""
        order = await self.get_order_by_id(order_id)
        if not order:
            return []
        
        udis = []
        for item in order.get("items", []):
            udis.extend(item.get("udi_numbers", []))
        
        return [{"udi": udi} for udi in udis]
    
    # RFQ operations
    async def get_rfq_by_id(self, rfq_id: str) -> Optional[Dict]:
        """Get RFQ by ID."""
        try:
            result = await self._request(
                "GET",
                f"/api/database/rows/table/{BASEROW_TABLES['rfq_submissions']}/{rfq_id}/",
            )
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def list_rfqs(
        self,
        page: int = 1,
        per_page: int = 20,
        filters: Optional[Dict] = None,
    ) -> Dict:
        """List RFQs."""
        params = {"page": page, "size": per_page}
        
        if filters:
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}"] = value
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['rfq_submissions']}/",
            params=params,
        )
    
    async def create_rfq(self, rfq_data: Dict) -> Dict:
        """Create new RFQ."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{BASEROW_TABLES['rfq_submissions']}/",
            json_data=rfq_data,
        )
    
    async def update_rfq(self, rfq_id: str, updates: Dict) -> Dict:
        """Update RFQ."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['rfq_submissions']}/{rfq_id}/",
            json_data=updates,
        )
    
    async def count_rfqs(self) -> int:
        """Count total RFQs."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['rfq_submissions']}/",
            params={"size": 1},
        )
        return result.get("count", 0)
    
    # Quote operations
    async def get_quote_by_id(self, quote_id: str) -> Optional[Dict]:
        """Get quote by ID."""
        try:
            result = await self._request(
                "GET",
                f"/api/database/rows/table/{BASEROW_TABLES['quotes']}/{quote_id}/",
            )
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def get_rfq_quotes(self, rfq_id: str) -> List[Dict]:
        """Get quotes for an RFQ."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['quotes']}/",
            params={"filter__rfq_id": rfq_id},
        )
        return result.get("results", [])
    
    async def create_quote(self, quote_data: Dict) -> Dict:
        """Create new quote."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{BASEROW_TABLES['quotes']}/",
            json_data=quote_data,
        )
    
    async def update_quote(self, quote_id: str, updates: Dict) -> Dict:
        """Update quote."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['quotes']}/{quote_id}/",
            json_data=updates,
        )
    
    # Order operations
    async def get_order_by_id(self, order_id: str) -> Optional[Dict]:
        """Get order by ID."""
        try:
            result = await self._request(
                "GET",
                f"/api/database/rows/table/{BASEROW_TABLES['orders']}/{order_id}/",
            )
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def list_orders(
        self,
        page: int = 1,
        per_page: int = 20,
        filters: Optional[Dict] = None,
    ) -> Dict:
        """List orders."""
        params = {"page": page, "size": per_page}
        
        if filters:
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}"] = value
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/",
            params=params,
        )
    
    async def create_order(self, order_data: Dict) -> Dict:
        """Create new order."""
        return await self._request(
            "POST",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/",
            json_data=order_data,
        )
    
    async def update_order(self, order_id: str, updates: Dict) -> Dict:
        """Update order."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/{order_id}/",
            json_data=updates,
        )
    
    async def count_orders(self) -> int:
        """Count total orders."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/",
            params={"size": 1},
        )
        return result.get("count", 0)
    
    # GPO operations
    async def list_gpos(self) -> List[Dict]:
        """List all GPOs."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['gpo_contracts']}/",
        )
        return result.get("results", [])
    
    async def get_gpo_by_id(self, gpo_id: str) -> Optional[Dict]:
        """Get GPO by ID."""
        try:
            result = await self._request(
                "GET",
                f"/api/database/rows/table/{BASEROW_TABLES['gpo_contracts']}/{gpo_id}/",
            )
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def get_gpo_contracts(self, gpo_id: str) -> List[Dict]:
        """Get contracts for a GPO."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['gpo_contracts']}/",
            params={"filter__gpo_id": gpo_id},
        )
        return result.get("results", [])
    
    async def get_equipment_gpo_pricing(self, equipment_id: str) -> List[Dict]:
        """Get GPO pricing for equipment."""
        # Mock data for now
        return [
            {
                "gpo_id": "gpo-1",
                "gpo_name": "Premier Inc.",
                "contract_number": "PRE-2024-001",
                "tier": 2,
                "tier_name": "Preferred",
                "price": 42500.00,
                "savings_vs_list": 2500.00,
                "savings_percent": 5.6,
            },
            {
                "gpo_id": "gpo-2",
                "gpo_name": "Vizient",
                "contract_number": "VIZ-2024-045",
                "tier": 3,
                "tier_name": "Strategic",
                "price": 40500.00,
                "savings_vs_list": 4500.00,
                "savings_percent": 10.0,
            },
        ]
    
    async def get_organization_orders(self, organization_id: str, period: str) -> List[Dict]:
        """Get orders for an organization."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['orders']}/",
            params={"filter__organization_id": organization_id},
        )
        return result.get("results", [])
    
    async def get_organization_gpo_contracts(self, organization_id: str) -> List[Dict]:
        """Get GPO contracts for an organization."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['gpo_contracts']}/",
        )
        return result.get("results", [])
    
    # Supplier operations
    async def list_suppliers(self, page: int = 1, per_page: int = 20) -> Dict:
        """List suppliers."""
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['suppliers']}/",
            params={"page": page, "size": per_page},
        )
    
    async def update_supplier(self, supplier_id: str, updates: Dict) -> Dict:
        """Update supplier."""
        return await self._request(
            "PATCH",
            f"/api/database/rows/table/{BASEROW_TABLES['suppliers']}/{supplier_id}/",
            json_data=updates,
        )
    
    async def count_suppliers(self) -> int:
        """Count total suppliers."""
        result = await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['suppliers']}/",
            params={"size": 1},
        )
        return result.get("count", 0)
    
    # Audit log operations
    async def get_audit_log(
        self,
        page: int = 1,
        per_page: int = 50,
        filters: Optional[Dict] = None,
    ) -> Dict:
        """Get audit log entries."""
        params = {"page": page, "size": per_page}
        
        if filters:
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}"] = value
        
        return await self._request(
            "GET",
            f"/api/database/rows/table/{BASEROW_TABLES['audit_log']}/",
            params=params,
        )
