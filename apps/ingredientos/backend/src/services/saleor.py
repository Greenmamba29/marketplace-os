"""
Saleor integration service for e-commerce functionality
"""

from typing import Any, Dict, List, Optional
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings


class SaleorService:
    """Service for interacting with Saleor GraphQL API"""
    
    def __init__(self):
        settings = get_settings()
        self.api_url = settings.saleor_api_url.rstrip("/")
        self.token = settings.saleor_token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _graphql_request(self, query: str, variables: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a GraphQL request to Saleor"""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_url}/graphql/",
                headers=self.headers,
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            
            if "errors" in data:
                raise Exception(f"GraphQL errors: {data['errors']}")
            
            return data.get("data", {})
    
    async def get_products(
        self,
        first: int = 20,
        after: Optional[str] = None,
        channel: str = "default-channel",
    ) -> Dict[str, Any]:
        """Get products from Saleor"""
        query = """
        query GetProducts($first: Int!, $after: String, $channel: String!) {
            products(first: $first, after: $after, channel: $channel) {
                edges {
                    node {
                        id
                        name
                        description
                        slug
                        category {
                            name
                        }
                        pricing {
                            priceRange {
                                start {
                                    gross {
                                        amount
                                        currency
                                    }
                                }
                            }
                        }
                        attributes {
                            attribute {
                                name
                            }
                            values {
                                name
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
        """
        
        variables = {
            "first": first,
            "channel": channel,
        }
        if after:
            variables["after"] = after
        
        return await self._graphql_request(query, variables)
    
    async def get_product(self, product_id: str, channel: str = "default-channel") -> Dict[str, Any]:
        """Get a single product by ID"""
        query = """
        query GetProduct($id: ID!, $channel: String!) {
            product(id: $id, channel: $channel) {
                id
                name
                description
                slug
                category {
                    name
                }
                pricing {
                    priceRange {
                        start {
                            gross {
                                amount
                                currency
                            }
                        }
                    }
                }
                attributes {
                    attribute {
                        name
                    }
                    values {
                        name
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
                }
            }
        }
        """
        
        variables = {
            "id": product_id,
            "channel": channel,
        }
        
        return await self._graphql_request(query, variables)
    
    async def create_product(
        self,
        name: str,
        description: str,
        category: str,
        attributes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Create a new product in Saleor"""
        query = """
        mutation CreateProduct($input: ProductCreateInput!) {
            productCreate(input: $input) {
                product {
                    id
                    name
                    slug
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        
        variables = {
            "input": {
                "name": name,
                "description": description,
                "category": category,
                "attributes": attributes,
            }
        }
        
        return await self._graphql_request(query, variables)
    
    async def update_product(
        self,
        product_id: str,
        name: Optional[str] = None,
        description: Optional[str] = None,
        attributes: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Update an existing product"""
        query = """
        mutation UpdateProduct($id: ID!, $input: ProductInput!) {
            productUpdate(id: $id, input: $input) {
                product {
                    id
                    name
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        
        input_data = {}
        if name:
            input_data["name"] = name
        if description:
            input_data["description"] = description
        if attributes:
            input_data["attributes"] = attributes
        
        variables = {
            "id": product_id,
            "input": input_data,
        }
        
        return await self._graphql_request(query, variables)
    
    async def create_product_variant(
        self,
        product_id: str,
        sku: str,
        attributes: List[Dict[str, Any]],
        price: float,
        currency: str = "USD",
    ) -> Dict[str, Any]:
        """Create a product variant with pricing"""
        query = """
        mutation CreateProductVariant($input: ProductVariantCreateInput!) {
            productVariantCreate(input: $input) {
                productVariant {
                    id
                    name
                    sku
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        
        variables = {
            "input": {
                "product": product_id,
                "sku": sku,
                "attributes": attributes,
                "price": price,
                "currency": currency,
            }
        }
        
        return await self._graphql_request(query, variables)
    
    async def get_orders(
        self,
        first: int = 20,
        after: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get orders from Saleor"""
        query = """
        query GetOrders($first: Int!, $after: String) {
            orders(first: $first, after: $after) {
                edges {
                    node {
                        id
                        number
                        created
                        status
                        total {
                            gross {
                                amount
                                currency
                            }
                        }
                        user {
                            email
                        }
                        lines {
                            productName
                            quantity
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
        """
        
        variables = {"first": first}
        if after:
            variables["after"] = after
        
        return await self._graphql_request(query, variables)
    
    async def sync_ingredient_to_saleor(
        self,
        ingredient_id: str,
        name: str,
        description: str,
        category: str,
        price_per_kg: float,
        moq_kg: int,
        certifications: List[str],
    ) -> Dict[str, Any]:
        """Sync an ingredient from IngredientOS to Saleor"""
        # First, create or update the product
        attributes = [
            {
                "id": "attr_certifications",
                "values": certifications,
            },
            {
                "id": "attr_moq",
                "values": [str(moq_kg)],
            },
        ]
        
        # Create product
        product_result = await self.create_product(
            name=name,
            description=description,
            category=category,
            attributes=attributes,
        )
        
        product_id = product_result.get("productCreate", {}).get("product", {}).get("id")
        
        if product_id:
            # Create variant with pricing
            await self.create_product_variant(
                product_id=product_id,
                sku=f"ING-{ingredient_id}",
                attributes=[],
                price=price_per_kg,
            )
        
        return product_result
