"""Medusa.js integration service."""

import logging
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import get_settings

logger = logging.getLogger(__name__)


class MedusaService:
    """Service for interacting with Medusa.js e-commerce platform."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.MEDUSA_URL
        self.api_key = self.settings.MEDUSA_API_KEY
        self.headers = {
            "x-publishable-api-key": self.api_key,
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
        """Make a request to Medusa API."""
        url = f"{self.base_url}/store/{endpoint}"
        
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
    
    # Product operations
    async def list_products(
        self,
        category_id: Optional[str] = None,
        query: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Dict:
        """List products from Medusa."""
        params = {
            "offset": (page - 1) * limit,
            "limit": limit,
        }
        if category_id:
            params["category_id"] = category_id
        if query:
            params["q"] = query
        
        return await self._request("GET", "products", params)
    
    async def get_product(self, product_id: str) -> Optional[Dict]:
        """Get product by ID."""
        try:
            result = await self._request("GET", f"products/{product_id}")
            return result.get("product")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    # Category operations
    async def list_categories(self) -> List[Dict]:
        """List product categories."""
        result = await self._request("GET", "product-categories")
        return result.get("product_categories", [])
    
    # Cart operations
    async def create_cart(self) -> Dict:
        """Create a new cart."""
        return await self._request("POST", "carts")
    
    async def add_to_cart(
        self,
        cart_id: str,
        variant_id: str,
        quantity: int,
    ) -> Dict:
        """Add item to cart."""
        return await self._request(
            "POST",
            f"carts/{cart_id}/line-items",
            json_data={
                "variant_id": variant_id,
                "quantity": quantity,
            },
        )
    
    # Order operations
    async def create_order(
        self,
        cart_id: str,
        shipping_address: Dict,
        billing_address: Dict,
        email: str,
    ) -> Dict:
        """Create an order from cart."""
        # First update cart with addresses
        await self._request(
            "POST",
            f"carts/{cart_id}",
            json_data={
                "shipping_address": shipping_address,
                "billing_address": billing_address,
                "email": email,
            },
        )
        
        # Complete cart to create order
        return await self._request("POST", f"carts/{cart_id}/complete")
    
    # Customer operations
    async def create_customer(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
    ) -> Dict:
        """Create a new customer."""
        return await self._request(
            "POST",
            "customers",
            json_data={
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            },
        )
    
    async def login_customer(self, email: str, password: str) -> Dict:
        """Login customer."""
        return await self._request(
            "POST",
            "auth",
            json_data={
                "email": email,
                "password": password,
            },
        )
    
    # Region operations
    async def list_regions(self) -> List[Dict]:
        """List available regions."""
        result = await self._request("GET", "regions")
        return result.get("regions", [])
    
    # Shipping options
    async def list_shipping_options(
        self,
        cart_id: str,
    ) -> List[Dict]:
        """List shipping options for cart."""
        result = await self._request(
            "GET",
            f"shipping-options/{cart_id}",
        )
        return result.get("shipping_options", [])
    
    async def add_shipping_method(
        self,
        cart_id: str,
        option_id: str,
    ) -> Dict:
        """Add shipping method to cart."""
        return await self._request(
            "POST",
            f"carts/{cart_id}/shipping-methods",
            json_data={"option_id": option_id},
        )
