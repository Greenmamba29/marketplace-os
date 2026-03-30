"""Medusa.js integration service for fulfillment logistics."""

import logging
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings

logger = logging.getLogger(__name__)


class MedusaService:
    """Service for interacting with Medusa.js for order fulfillment."""
    
    def __init__(self) -> None:
        """Initialize Medusa service."""
        self.base_url = settings.MEDUSA_URL
        self.api_key = settings.MEDUSA_API_KEY
        
        if not self.base_url or not self.api_key:
            logger.warning("Medusa configuration missing - fulfillment features disabled")
            self.enabled = False
            return
        
        self.enabled = True
        self.client = httpx.AsyncClient(
            base_url=self.base_url.rstrip("/"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def _request(
        self,
        method: str,
        endpoint: str,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Make a request to Medusa API."""
        if not self.enabled:
            raise RuntimeError("Medusa service is not configured")
        
        try:
            response = await self.client.request(method, f"/admin/{endpoint}", **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Medusa API error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Medusa request failed: {e}")
            raise
    
    async def create_order(
        self,
        order_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create an order in Medusa."""
        if not self.enabled:
            logger.warning("Medusa not configured - skipping order creation")
            return {"id": "mock-order-id", "status": "pending"}
        
        # Transform BuildSource order to Medusa format
        medusa_order = {
            "email": order_data.get("buyer_email"),
            "items": [
                {
                    "variant_id": item.get("material_id"),
                    "quantity": item.get("quantity"),
                    "metadata": {
                        "unit_price": item.get("unit_price"),
                        "description": item.get("description"),
                    },
                }
                for item in order_data.get("items", [])
            ],
            "shipping_address": self._transform_address(order_data.get("delivery_address")),
            "metadata": {
                "buildsource_order_id": order_data.get("id"),
                "project_id": order_data.get("project_id"),
                "delivery_type": order_data.get("delivery_type"),
                "po_number": order_data.get("po_number"),
            },
        }
        
        return await self._request("POST", "orders", json=medusa_order)
    
    async def get_order(self, order_id: str) -> Dict[str, Any]:
        """Get order details from Medusa."""
        if not self.enabled:
            return {"id": order_id, "status": "mock"}
        
        return await self._request("GET", f"orders/{order_id}")
    
    async def update_order_status(
        self,
        order_id: str,
        status: str,
    ) -> Dict[str, Any]:
        """Update order status in Medusa."""
        if not self.enabled:
            return {"id": order_id, "status": status}
        
        return await self._request(
            "POST",
            f"orders/{order_id}/status",
            json={"status": status},
        )
    
    async def create_fulfillment(
        self,
        order_id: str,
        items: List[Dict[str, Any]],
        tracking: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a fulfillment for an order."""
        if not self.enabled:
            return {"id": "mock-fulfillment-id", "status": "created"}
        
        fulfillment_data: Dict[str, Any] = {
            "items": items,
        }
        
        if tracking:
            fulfillment_data["metadata"] = {
                "tracking_number": tracking.get("tracking_number"),
                "carrier": tracking.get("carrier"),
            }
        
        return await self._request(
            "POST",
            f"orders/{order_id}/fulfillment",
            json=fulfillment_data,
        )
    
    async def create_shipment(
        self,
        fulfillment_id: str,
        tracking: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a shipment for a fulfillment."""
        if not self.enabled:
            return {"id": "mock-shipment-id", "status": "shipped"}
        
        return await self._request(
            "POST",
            f"fulfillments/{fulfillment_id}/shipments",
            json={
                "tracking_numbers": [tracking.get("tracking_number")],
                "metadata": tracking,
            },
        )
    
    async def get_shipping_options(
        self,
        region_id: str,
    ) -> List[Dict[str, Any]]:
        """Get available shipping options for a region."""
        if not self.enabled:
            return []
        
        result = await self._request(
            "GET",
            "shipping-options",
            params={"region_id": region_id},
        )
        return result.get("shipping_options", [])
    
    def _transform_address(self, address: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Transform BuildSource address to Medusa format."""
        if not address:
            return {}
        
        return {
            "first_name": address.get("contact_name", "").split()[0] if address.get("contact_name") else "",
            "last_name": " ".join(address.get("contact_name", "").split()[1:]) if address.get("contact_name") else "",
            "address_1": address.get("street", ""),
            "city": address.get("city", ""),
            "province": address.get("state", ""),
            "postal_code": address.get("zip", ""),
            "country_code": "us",  # Default to US
        }
    
    async def sync_inventory(
        self,
        material_id: str,
        quantity: int,
    ) -> Dict[str, Any]:
        """Sync inventory level with Medusa."""
        if not self.enabled:
            return {"id": material_id, "inventory": quantity}
        
        return await self._request(
            "POST",
            f"variants/{material_id}/inventory",
            json={"quantity": quantity},
        )
    
    async def close(self) -> None:
        """Close the HTTP client."""
        if self.enabled:
            await self.client.aclose()


# Singleton instance
_medusa_service: Optional[MedusaService] = None


def get_medusa_service() -> MedusaService:
    """Get or create Medusa service instance."""
    global _medusa_service
    if _medusa_service is None:
        _medusa_service = MedusaService()
    return _medusa_service
