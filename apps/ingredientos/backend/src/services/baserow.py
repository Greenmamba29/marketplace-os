"""
Baserow integration service
All API calls use user_field_names=true for human-readable field names
"""

from typing import Any, Dict, List, Optional
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings


class BaserowService:
    """Service for interacting with Baserow API"""
    
    def __init__(self):
        settings = get_settings()
        self.base_url = settings.baserow_api_url.rstrip("/")
        self.token = settings.baserow_token
        self.database_id = settings.baserow_database_id
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
        """Make a request to the Baserow API"""
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
        table_id: str,
        page: int = 1,
        size: int = 100,
        filters: Optional[Dict] = None,
        order_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List rows from a table"""
        params = {"page": page, "size": size}
        
        if filters:
            params.update(filters)
        if order_by:
            params["order_by"] = order_by
        
        return await self._request("GET", f"{table_id}/", params=params)
    
    async def get_row(self, table_id: str, row_id: str) -> Dict[str, Any]:
        """Get a single row by ID"""
        return await self._request("GET", f"{table_id}/{row_id}/")
    
    async def create_row(self, table_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new row"""
        return await self._request("POST", f"{table_id}/", json_data=data)
    
    async def update_row(
        self,
        table_id: str,
        row_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing row"""
        return await self._request("PATCH", f"{table_id}/{row_id}/", json_data=data)
    
    async def delete_row(self, table_id: str, row_id: str) -> None:
        """Delete a row"""
        await self._request("DELETE", f"{table_id}/{row_id}/")
    
    # Table-specific methods
    
    async def get_ingredients(
        self,
        page: int = 1,
        per_page: int = 20,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get ingredients from the PRODUCTS table"""
        filters = {}
        if category:
            filters["filter__category__equal"] = category
        if status:
            filters["filter__status__equal"] = status
        
        return await self.list_rows(
            table_id="PRODUCTS",
            page=page,
            size=per_page,
            filters=filters,
        )
    
    async def get_ingredient(self, ingredient_id: str) -> Dict[str, Any]:
        """Get a single ingredient by ID"""
        return await self.get_row("PRODUCTS", ingredient_id)
    
    async def create_ingredient(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new ingredient"""
        return await self.create_row("PRODUCTS", data)
    
    async def update_ingredient(
        self,
        ingredient_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an ingredient"""
        return await self.update_row("PRODUCTS", ingredient_id, data)
    
    async def get_supplier(self, supplier_id: str) -> Dict[str, Any]:
        """Get a supplier by ID"""
        return await self.get_row("SUPPLIERS", supplier_id)
    
    async def get_suppliers(
        self,
        page: int = 1,
        per_page: int = 20,
        verified: Optional[bool] = None,
    ) -> Dict[str, Any]:
        """Get suppliers"""
        filters = {}
        if verified is not None:
            filters["filter__verified__equal"] = str(verified).lower()
        
        return await self.list_rows(
            table_id="SUPPLIERS",
            page=page,
            size=per_page,
            filters=filters,
        )
    
    async def get_certifications(self, ingredient_id: str) -> List[Dict[str, Any]]:
        """Get certifications for an ingredient"""
        result = await self.list_rows(
            table_id="CERTIFICATIONS",
            filters={"filter__ingredient_id__equal": ingredient_id},
        )
        return result.get("results", [])
    
    async def create_certification(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new certification"""
        return await self.create_row("CERTIFICATIONS", data)
    
    async def get_gras_status(self, ingredient_id: str) -> Optional[Dict[str, Any]]:
        """Get GRAS status for an ingredient"""
        result = await self.list_rows(
            table_id="REGULATORY_STATUS",
            filters={"filter__ingredient_id__equal": ingredient_id},
            size=1,
        )
        results = result.get("results", [])
        return results[0] if results else None
    
    async def create_gras_status(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create GRAS status record"""
        return await self.create_row("REGULATORY_STATUS", data)
    
    async def get_allergen_profile(self, ingredient_id: str) -> Optional[Dict[str, Any]]:
        """Get allergen profile for an ingredient"""
        result = await self.list_rows(
            table_id="ALLERGEN_PROFILES",
            filters={"filter__ingredient_id__equal": ingredient_id},
            size=1,
        )
        results = result.get("results", [])
        return results[0] if results else None
    
    async def create_allergen_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create allergen profile"""
        return await self.create_row("ALLERGEN_PROFILES", data)
    
    async def get_functional_claims(self, ingredient_id: str) -> List[Dict[str, Any]]:
        """Get functional claims for an ingredient"""
        result = await self.list_rows(
            table_id="FUNCTIONAL_CLAIMS",
            filters={"filter__ingredient_id__equal": ingredient_id},
        )
        return result.get("results", [])
    
    async def create_rfq(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new RFQ"""
        return await self.create_row("RFQ_SUBMISSIONS", data)
    
    async def get_rfqs(
        self,
        buyer_id: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Get RFQs"""
        filters = {}
        if buyer_id:
            filters["filter__buyer_id__equal"] = buyer_id
        if status:
            filters["filter__status__equal"] = status
        
        return await self.list_rows(
            table_id="RFQ_SUBMISSIONS",
            page=page,
            size=per_page,
            filters=filters,
        )
    
    async def get_rfq(self, rfq_id: str) -> Dict[str, Any]:
        """Get a single RFQ by ID"""
        return await self.get_row("RFQ_SUBMISSIONS", rfq_id)
    
    async def create_quote(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new quote"""
        return await self.create_row("QUOTES", data)
    
    async def get_quotes(self, rfq_id: str) -> List[Dict[str, Any]]:
        """Get quotes for an RFQ"""
        result = await self.list_rows(
            table_id="QUOTES",
            filters={"filter__rfq_id__equal": rfq_id},
        )
        return result.get("results", [])
    
    async def create_order(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new order"""
        return await self.create_row("ORDERS", data)
    
    async def get_orders(
        self,
        buyer_id: Optional[str] = None,
        supplier_id: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Get orders"""
        filters = {}
        if buyer_id:
            filters["filter__buyer_id__equal"] = buyer_id
        if supplier_id:
            filters["filter__supplier_id__equal"] = supplier_id
        if status:
            filters["filter__status__equal"] = status
        
        return await self.list_rows(
            table_id="ORDERS",
            page=page,
            size=per_page,
            filters=filters,
        )
    
    async def create_audit_log(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an audit log entry"""
        return await self.create_row("AUDIT_LOG", data)
    
    async def get_compliance_records(
        self,
        entity_type: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get compliance records"""
        filters = {}
        if entity_type:
            filters["filter__entity_type__equal"] = entity_type
        if status:
            filters["filter__status__equal"] = status
        
        result = await self.list_rows(
            table_id="COMPLIANCE_RECORDS",
            filters=filters,
        )
        return result.get("results", [])
