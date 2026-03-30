"""
Saleor E-commerce Integration Service for LabSource

Handles product catalog, attributes, and order management via Saleor GraphQL API.
"""

import json
import logging
from typing import Any, Dict, List, Optional
from functools import lru_cache

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings

logger = logging.getLogger(__name__)


class SaleorError(Exception):
    """Saleor API error."""
    pass


class SaleorService:
    """Service for interacting with Saleor e-commerce platform."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.saleor_url.rstrip("/")
        self.token = self.settings.saleor_token
        self.channel = self.settings.saleor_channel
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _graphql_request(self, query: str, variables: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a GraphQL request to Saleor API."""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
        
        try:
            response = await self.client.post("/graphql/", json=payload)
            response.raise_for_status()
            data = response.json()
            
            if "errors" in data:
                logger.error(f"Saleor GraphQL errors: {data['errors']}")
                raise SaleorError(f"GraphQL errors: {data['errors']}")
            
            return data.get("data", {})
        except httpx.HTTPStatusError as e:
            logger.error(f"Saleor API error: {e.response.status_code} - {e.response.text}")
            raise SaleorError(f"Saleor API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Saleor request error: {e}")
            raise SaleorError(f"Request failed: {e}")
    
    # Product operations
    
    async def get_products(
        self,
        first: int = 20,
        after: Optional[str] = None,
        channel: Optional[str] = None,
        filter_input: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Get products from Saleor."""
        query = """
        query GetProducts($first: Int!, $after: String, $channel: String, $filter: ProductFilterInput) {
            products(first: $first, after: $after, channel: $channel, filter: $filter) {
                edges {
                    node {
                        id
                        name
                        slug
                        description
                        category {
                            name
                            slug
                        }
                        attributes {
                            attribute {
                                name
                                slug
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
                            attributes {
                                attribute {
                                    name
                                    slug
                                }
                                values {
                                    name
                                }
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }
        """
        variables = {
            "first": first,
            "after": after,
            "channel": channel or self.channel,
            "filter": filter_input,
        }
        return await self._graphql_request(query, variables)
    
    async def get_product(self, product_id: str, channel: Optional[str] = None) -> Dict[str, Any]:
        """Get a single product from Saleor."""
        query = """
        query GetProduct($id: ID!, $channel: String) {
            product(id: $id, channel: $channel) {
                id
                name
                slug
                description
                seoTitle
                seoDescription
                category {
                    id
                    name
                    slug
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
                    attributes {
                        attribute {
                            name
                            slug
                        }
                        values {
                            name
                        }
                    }
                    pricing {
                        price {
                            gross {
                                amount
                                currency
                            }
                        }
                    }
                    stocks {
                        warehouse {
                            name
                        }
                        quantity
                        quantityAllocated
                    }
                }
            }
        }
        """
        variables = {"id": product_id, "channel": channel or self.channel}
        result = await self._graphql_request(query, variables)
        return result.get("product", {})
    
    async def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new product in Saleor."""
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
        variables = {"input": product_data}
        return await self._graphql_request(query, variables)
    
    async def update_product(self, product_id: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing product in Saleor."""
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
        variables = {"id": product_id, "input": product_data}
        return await self._graphql_request(query, variables)
    
    # Product Variant operations (for lots)
    
    async def create_product_variant(self, variant_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a product variant (lot) in Saleor."""
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
        variables = {"input": variant_data}
        return await self._graphql_request(query, variables)
    
    async def update_variant_metadata(self, variant_id: str, metadata: Dict[str, str]) -> Dict[str, Any]:
        """Update variant metadata (for lot tracking)."""
        query = """
        mutation UpdateVariantMetadata($id: ID!, $input: ProductVariantInput!) {
            productVariantUpdate(id: $id, input: $input) {
                productVariant {
                    id
                    metadata {
                        key
                        value
                    }
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        variables = {"id": variant_id, "input": {"metadata": [{"key": k, "value": v} for k, v in metadata.items()]}}
        return await self._graphql_request(query, variables)
    
    # Order operations
    
    async def get_orders(
        self,
        first: int = 20,
        after: Optional[str] = None,
        filter_input: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Get orders from Saleor."""
        query = """
        query GetOrders($first: Int!, $after: String, $filter: OrderFilterInput) {
            orders(first: $first, after: $after, filter: $filter) {
                edges {
                    node {
                        id
                        number
                        status
                        created
                        total {
                            gross {
                                amount
                                currency
                            }
                        }
                        lines {
                            productName
                            variantName
                            quantity
                            unitPrice {
                                gross {
                                    amount
                                }
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
        """
        variables = {"first": first, "after": after, "filter": filter_input}
        return await self._graphql_request(query, variables)
    
    async def create_order_from_checkout(self, checkout_id: str) -> Dict[str, Any]:
        """Create an order from a checkout."""
        query = """
        mutation OrderCreateFromCheckout($id: ID!) {
            orderCreateFromCheckout(id: $id) {
                order {
                    id
                    number
                    status
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        variables = {"id": checkout_id}
        return await self._graphql_request(query, variables)
    
    # Attribute operations (for reagent specifications)
    
    async def get_attributes(self, first: int = 100) -> List[Dict[str, Any]]:
        """Get product attributes from Saleor."""
        query = """
        query GetAttributes($first: Int!) {
            attributes(first: $first) {
                edges {
                    node {
                        id
                        name
                        slug
                        type
                        inputType
                        choices {
                            edges {
                                node {
                                    name
                                    slug
                                }
                            }
                        }
                    }
                }
            }
        }
        """
        variables = {"first": first}
        result = await self._graphql_request(query, variables)
        return [edge["node"] for edge in result.get("attributes", {}).get("edges", [])]
    
    async def assign_attributes_to_product(
        self,
        product_id: str,
        attributes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Assign attributes to a product."""
        query = """
        mutation AssignProductAttributes($id: ID!, $operations: [ProductAttributeAssignInput!]!) {
            productAttributeAssign(productId: $id, operations: $operations) {
                product {
                    id
                    attributes {
                        attribute {
                            name
                        }
                        values {
                            name
                        }
                    }
                }
                errors {
                    field
                    message
                }
            }
        }
        """
        variables = {"id": product_id, "operations": attributes}
        return await self._graphql_request(query, variables)


@lru_cache()
def get_saleor_service() -> SaleorService:
    """Get cached Saleor service instance."""
    return SaleorService()
