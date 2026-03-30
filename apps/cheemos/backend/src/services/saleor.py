"""Saleor service for product/catalog management."""

from typing import Any, Dict, List, Optional

import httpx

from src.config import get_settings


class SaleorService:
    """Service for interacting with Saleor GraphQL API."""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_url = self.settings.SALEOR_API_URL
        self.token = self.settings.SALEOR_TOKEN
    
    def _get_headers(self) -> Dict[str, str]:
        """Get request headers."""
        headers = {
            "Content-Type": "application/json",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    async def _graphql_query(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute a GraphQL query."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.api_url,
                headers=self._get_headers(),
                json={
                    "query": query,
                    "variables": variables or {},
                },
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            
            if "errors" in data:
                raise Exception(data["errors"][0]["message"])
            
            return data["data"]
    
    async def get_products(
        self,
        first: int = 20,
        search: Optional[str] = None,
        category_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get products from Saleor."""
        query = """
            query GetProducts($first: Int!, $filter: ProductFilterInput) {
                products(first: $first, filter: $filter) {
                    edges {
                        node {
                            id
                            name
                            slug
                            description
                            category {
                                id
                                name
                            }
                            attributes {
                                attribute {
                                    name
                                    slug
                                }
                                values {
                                    name
                                    slug
                                }
                            }
                            variants {
                                id
                                name
                                sku
                                pricing {
                                    price {
                                        gross {
                                            amount
                                            currency
                                        }
                                    }
                                }
                                quantityAvailable
                            }
                            isAvailable
                        }
                    }
                }
            }
        """
        
        filter_params = {}
        if search:
            filter_params["search"] = search
        if category_id:
            filter_params["categories"] = [category_id]
        
        result = await self._graphql_query(query, {
            "first": first,
            "filter": filter_params if filter_params else None,
        })
        
        return [edge["node"] for edge in result["products"]["edges"]]
    
    async def get_product(self, slug: str) -> Optional[Dict[str, Any]]:
        """Get a single product by slug."""
        query = """
            query GetProduct($slug: String!) {
                product(slug: $slug) {
                    id
                    name
                    slug
                    description
                    category {
                        id
                        name
                    }
                    attributes {
                        attribute {
                            name
                            slug
                        }
                        values {
                            name
                            slug
                        }
                    }
                    variants {
                        id
                        name
                        sku
                        pricing {
                            price {
                                gross {
                                    amount
                                    currency
                                }
                            }
                        }
                        quantityAvailable
                    }
                    isAvailable
                }
            }
        """
        
        result = await self._graphql_query(query, {"slug": slug})
        return result.get("product")
    
    async def create_checkout(
        self,
        email: str,
        lines: List[Dict[str, Any]],
        shipping_address: Optional[Dict[str, Any]] = None,
        billing_address: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a checkout."""
        query = """
            mutation CreateCheckout($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        token
                    }
                    errors {
                        field
                        message
                    }
                }
            }
        """
        
        input_data = {
            "email": email,
            "lines": lines,
        }
        
        if shipping_address:
            input_data["shippingAddress"] = shipping_address
        if billing_address:
            input_data["billingAddress"] = billing_address
        
        result = await self._graphql_query(query, {"input": input_data})
        
        if result["checkoutCreate"]["errors"]:
            raise Exception(result["checkoutCreate"]["errors"][0]["message"])
        
        return result["checkoutCreate"]["checkout"]


# Singleton instance
_saleor_service: Optional[SaleorService] = None


def get_saleor_service() -> SaleorService:
    """Get or create Saleor service singleton."""
    global _saleor_service
    if _saleor_service is None:
        _saleor_service = SaleorService()
    return _saleor_service
