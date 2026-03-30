"""FDA API integration service."""

from typing import Any, Dict, Optional

import httpx
import structlog

from ..config import get_settings

logger = structlog.get_logger()


class FDAService:
    """Service for interacting with FDA APIs."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.fda_api_url.rstrip("/")
        self.api_key = self.settings.fda_api_key
    
    def _get_headers(self) -> Dict[str, str]:
        """Get request headers."""
        headers = {
            "Accept": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers
    
    async def _request(
        self,
        endpoint: str,
        params: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make HTTP request to FDA API."""
        url = f"{self.base_url}{endpoint}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    url=url,
                    headers=self._get_headers(),
                    params=params,
                    timeout=30.0,
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(
                    "fda_request_failed",
                    url=url,
                    status_code=e.response.status_code,
                    response=e.response.text,
                )
                raise
            except Exception as e:
                logger.error(
                    "fda_request_error",
                    url=url,
                    error=str(e),
                )
                raise
    
    async def search_510k(
        self,
        product_code: Optional[str] = None,
        device_name: Optional[str] = None,
        applicant: Optional[str] = None,
        limit: int = 10,
    ) -> Dict[str, Any]:
        """Search 510(k) premarket notifications."""
        params = {"limit": limit}
        
        search_parts = []
        if product_code:
            search_parts.append(f'product_code:"{product_code}"')
        if device_name:
            search_parts.append(f'device_name:"{device_name}"')
        if applicant:
            search_parts.append(f'applicant:"{applicant}"')
        
        if search_parts:
            params["search"] = " AND ".join(search_parts)
        
        return await self._request("/device/510k.json", params)
    
    async def get_510k_by_number(self, k_number: str) -> Optional[Dict]:
        """Get 510(k) by K number."""
        try:
            result = await self._request(
                "/device/510k.json",
                params={"search": f'k_number:"{k_number}"'},
            )
            results = result.get("results", [])
            return results[0] if results else None
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def search_device_classification(
        self,
        product_code: Optional[str] = None,
        device_name: Optional[str] = None,
        device_class: Optional[str] = None,
        limit: int = 10,
    ) -> Dict[str, Any]:
        """Search device classification database."""
        params = {"limit": limit}
        
        search_parts = []
        if product_code:
            search_parts.append(f'product_code:"{product_code}"')
        if device_name:
            search_parts.append(f'device_name:"{device_name}"')
        if device_class:
            search_parts.append(f'device_class:"{device_class}"')
        
        if search_parts:
            params["search"] = " AND ".join(search_parts)
        
        return await self._request("/device/classification.json", params)
    
    async def get_device_classification(self, product_code: str) -> Optional[Dict]:
        """Get device classification by product code."""
        try:
            result = await self._request(
                "/device/classification.json",
                params={"search": f'product_code:"{product_code}"'},
            )
            results = result.get("results", [])
            return results[0] if results else None
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def search_recalls(
        self,
        product_code: Optional[str] = None,
        firm_fei_number: Optional[str] = None,
        status: str = "ongoing",
        limit: int = 10,
    ) -> Dict[str, Any]:
        """Search device recalls."""
        params = {"limit": limit}
        
        search_parts = []
        if product_code:
            search_parts.append(f'product_code:"{product_code}"')
        if firm_fei_number:
            search_parts.append(f'firm_fei_number:"{firm_fei_number}"')
        if status:
            search_parts.append(f'status:"{status}"')
        
        if search_parts:
            params["search"] = " AND ".join(search_parts)
        
        return await self._request("/device/recall.json", params)
    
    async def check_recall_status(self, product_code: str) -> Dict[str, Any]:
        """Check if device has active recalls."""
        try:
            result = await self.search_recalls(
                product_code=product_code,
                status="ongoing",
                limit=1,
            )
            recalls = result.get("results", [])
            
            return {
                "has_active_recalls": len(recalls) > 0,
                "recalls": recalls,
            }
        except Exception as e:
            logger.error(
                "recall_check_failed",
                product_code=product_code,
                error=str(e),
            )
            return {
                "has_active_recalls": False,
                "recalls": [],
                "error": str(e),
            }
    
    async def verify_device(
        self,
        product_code: Optional[str] = None,
        clearance_number: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Verify device FDA clearance and status."""
        from datetime import datetime
        
        result = {
            "verified": False,
            "device_info": {},
            "recall_status": {},
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        try:
            # Get device classification
            if product_code:
                classification = await self.get_device_classification(product_code)
                if classification:
                    result["device_info"]["classification"] = classification
                    result["verified"] = True
            
            # Get 510(k) details if available
            if clearance_number:
                clearance = await self.get_510k_by_number(clearance_number)
                if clearance:
                    result["device_info"]["clearance"] = clearance
                    result["verified"] = True
            
            # Check recall status
            if product_code:
                recall_status = await self.check_recall_status(product_code)
                result["recall_status"] = recall_status
        
        except Exception as e:
            logger.error(
                "device_verification_failed",
                product_code=product_code,
                clearance_number=clearance_number,
                error=str(e),
            )
            result["error"] = str(e)
        
        return result
    
    async def check_udi(self, udi: str) -> Dict[str, Any]:
        """Check UDI in FDA database."""
        # Note: FDA doesn't have a public UDI lookup API
        # This is a placeholder for future implementation
        
        return {
            "verified": False,
            "message": "UDI lookup not available via public FDA API",
            "udi": udi,
        }
    
    async def get_device_pma(self, pma_number: str) -> Optional[Dict]:
        """Get PMA (Premarket Approval) by number."""
        try:
            result = await self._request(
                "/device/pma.json",
                params={"search": f'pma_number:"{pma_number}"'},
            )
            results = result.get("results", [])
            return results[0] if results else None
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    async def search_enforcement_reports(
        self,
        product_code: Optional[str] = None,
        limit: int = 10,
    ) -> Dict[str, Any]:
        """Search enforcement reports."""
        params = {"limit": limit}
        
        if product_code:
            params["search"] = f'product_code:"{product_code}"'
        
        return await self._request("/device/enforcement.json", params)
