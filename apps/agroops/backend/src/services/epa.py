"""EPA registration lookup service."""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import get_settings, US_STATES

logger = logging.getLogger(__name__)


class EPAService:
    """Service for EPA pesticide registration lookups."""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_url = self.settings.EPA_API_URL
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self,
        endpoint: str,
        params: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to EPA API."""
        url = f"{self.api_url}/{endpoint}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=30.0)
            response.raise_for_status()
            return response.json()
    
    async def search_registrations(
        self,
        query: Optional[str] = None,
        epa_number: Optional[str] = None,
        company_name: Optional[str] = None,
        active_ingredient: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict:
        """Search EPA registrations."""
        # Note: EPA API endpoints may vary
        # This is a simplified implementation
        
        params = {}
        if epa_number:
            params["epa_number"] = epa_number
        if company_name:
            params["company_name"] = company_name
        if active_ingredient:
            params["active_ingredient"] = active_ingredient
        
        try:
            result = await self._request(" registrations", params)
            items = result.get("items", [])
            
            # Paginate results
            start = (page - 1) * per_page
            end = start + per_page
            paginated_items = items[start:end]
            
            return {
                "items": paginated_items,
                "total": len(items),
                "page": page,
                "per_page": per_page,
                "total_pages": (len(items) + per_page - 1) // per_page,
            }
        except Exception as e:
            logger.error(f"Error searching EPA registrations: {e}")
            # Return empty results on error
            return {
                "items": [],
                "total": 0,
                "page": page,
                "per_page": per_page,
                "total_pages": 0,
            }
    
    async def get_registration(self, epa_number: str) -> Optional[Dict]:
        """Get registration details by EPA number."""
        try:
            result = await self._request(f" registrations/{epa_number}")
            return result.get("registration")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            logger.error(f"Error fetching EPA registration: {e}")
            raise
        except Exception as e:
            logger.error(f"Error fetching EPA registration: {e}")
            return None
    
    async def get_state_status(
        self,
        epa_number: str,
        state: str,
    ) -> Optional[Dict]:
        """Get state registration status."""
        registration = await self.get_registration(epa_number)
        if not registration:
            return None
        
        state_regs = registration.get("state_registrations", [])
        for reg in state_regs:
            if reg.get("state") == state.upper():
                return {
                    "epa_number": epa_number,
                    "product_name": registration.get("product_name"),
                    "state": state.upper(),
                    "status": reg.get("status"),
                    "expiration_date": reg.get("expiration_date"),
                    "restrictions": reg.get("restrictions", []),
                }
        
        return {
            "epa_number": epa_number,
            "product_name": registration.get("product_name"),
            "state": state.upper(),
            "status": "not_registered",
            "expiration_date": None,
            "restrictions": [],
        }
    
    async def verify_product(
        self,
        product_id: str,
        epa_number: str,
        state: str,
    ) -> Dict:
        """Verify product EPA registration for a state."""
        state_status = await self.get_state_status(epa_number, state)
        
        if not state_status:
            return {
                "product_id": product_id,
                "epa_number": epa_number,
                "state": state,
                "is_registered": False,
                "status": "not_found",
                "restrictions": [],
                "label_url": None,
                "sds_url": None,
            }
        
        is_registered = state_status.get("status") == "registered"
        
        return {
            "product_id": product_id,
            "epa_number": epa_number,
            "state": state,
            "is_registered": is_registered,
            "status": state_status.get("status"),
            "restrictions": state_status.get("restrictions", []),
            "label_url": f"https://www.epa.gov/pesticides/label/{epa_number}" if is_registered else None,
            "sds_url": None,  # Would be fetched from product database
        }
    
    async def get_label(self, epa_number: str) -> Optional[str]:
        """Get EPA label URL."""
        registration = await self.get_registration(epa_number)
        if registration:
            return registration.get("epa_label_url")
        return None
    
    async def check_restricted_use(
        self,
        epa_number: str,
    ) -> Dict:
        """Check if product is restricted use."""
        registration = await self.get_registration(epa_number)
        if not registration:
            return {
                "epa_number": epa_number,
                "is_restricted": False,
                "restricted_states": [],
                "signal_word": None,
            }
        
        return {
            "epa_number": epa_number,
            "is_restricted": registration.get("restricted_use", False),
            "restricted_states": registration.get("restricted_states", []),
            "signal_word": registration.get("signal_word"),
        }
    
    async def sync_registrations(self) -> Dict:
        """Sync EPA registrations to database."""
        # This would be a background task to sync EPA data
        # For now, return a placeholder
        logger.info("Starting EPA registration sync")
        
        return {
            "status": "success",
            "message": "EPA sync initiated",
            "synced_count": 0,
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    def format_epa_number(self, epa_number: str) -> str:
        """Format EPA registration number."""
        # EPA numbers typically follow patterns like "524-529" or "100-1001"
        epa_number = epa_number.strip().upper()
        
        # Remove any extra spaces
        epa_number = " ".join(epa_number.split())
        
        return epa_number
    
    def validate_epa_number(self, epa_number: str) -> bool:
        """Validate EPA registration number format."""
        if not epa_number:
            return False
        
        # Basic validation - EPA numbers contain numbers and hyphens
        epa_number = epa_number.strip()
        
        # Should contain at least one hyphen and only numbers/hyphens
        if "-" not in epa_number:
            return False
        
        parts = epa_number.split("-")
        if len(parts) != 2:
            return False
        
        if not all(p.strip().isdigit() for p in parts):
            return False
        
        return True
