"""
SAM.gov Integration Service for GovSource Backend
"""

import httpx
from typing import Optional, List, Dict, Any
from functools import lru_cache
from tenacity import retry, stop_after_attempt, wait_exponential
import structlog

from ..config import get_settings

logger = structlog.get_logger()


class SamGovError(Exception):
    """SAM.gov API error."""
    pass


class SamGovService:
    """Service for interacting with SAM.gov API."""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.sam_gov_base_url.rstrip('/')
        self.api_key = self.settings.sam_gov_api_key
        
        if not self.api_key:
            logger.warning("SAM_GOV_API_KEY not set")
        
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None or self._client.is_closed:
            headers = {"Accept": "application/json"}
            if self.api_key:
                headers["api_key"] = self.api_key
            
            self._client = httpx.AsyncClient(
                headers=headers,
                timeout=30.0,
            )
        return self._client
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self, 
        method: str, 
        endpoint: str, 
        **kwargs
    ) -> Dict[str, Any]:
        """Make a request to SAM.gov API."""
        client = await self._get_client()
        url = f"{self.base_url}{endpoint}"
        
        # Add API key to params if not in headers
        if self.api_key and "params" in kwargs:
            kwargs["params"]["api_key"] = self.api_key
        
        try:
            response = await client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(
                "SAM.gov API error",
                status_code=e.response.status_code,
                response=e.response.text,
                endpoint=endpoint,
            )
            raise SamGovError(f"SAM.gov API error: {e.response.status_code}")
        except Exception as e:
            logger.error("SAM.gov request failed", error=str(e), endpoint=endpoint)
            raise SamGovError(f"Request failed: {str(e)}")
    
    async def search_entities(
        self,
        uei: Optional[str] = None,
        cage_code: Optional[str] = None,
        legal_business_name: Optional[str] = None,
        naics_code: Optional[str] = None,
        state: Optional[str] = None,
        registration_status: Optional[str] = None,
        page: int = 0,
        size: int = 10,
    ) -> Dict[str, Any]:
        """Search for entities in SAM.gov."""
        params = {"page": page, "size": size}
        
        if uei:
            params["ueiSAM"] = uei
        if cage_code:
            params["cageCode"] = cage_code
        if legal_business_name:
            params["legalBusinessName"] = legal_business_name
        if naics_code:
            params["naicsCode"] = naics_code
        if state:
            params["physicalAddressState"] = state
        if registration_status:
            params["registrationStatus"] = registration_status
        
        return await self._request(
            "GET",
            "/entity-information/v3/entities",
            params=params
        )
    
    async def get_entity(self, uei: str) -> Optional[Dict[str, Any]]:
        """Get entity details by UEI."""
        try:
            result = await self._request(
                "GET",
                f"/entity-information/v3/entities/{uei}"
            )
            return result
        except SamGovError:
            return None
    
    async def get_entity_by_cage(self, cage_code: str) -> Optional[Dict[str, Any]]:
        """Get entity details by CAGE code."""
        result = await self.search_entities(cage_code=cage_code, size=1)
        entities = result.get("entityData", [])
        return entities[0] if entities else None
    
    async def check_exclusions(
        self,
        duns: Optional[str] = None,
        cage_code: Optional[str] = None,
        name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Check for exclusions (debarred/suspended entities)."""
        params = {}
        
        if duns:
            params["duns"] = duns
        if cage_code:
            params["cageCode"] = cage_code
        if name:
            params["name"] = name
        
        return await self._request(
            "GET",
            "/entity-information/v1/exclusions",
            params=params
        )
    
    async def is_debarred(
        self,
        duns: Optional[str] = None,
        cage_code: Optional[str] = None,
    ) -> bool:
        """Check if an entity is debarred or suspended."""
        try:
            result = await self.check_exclusions(duns=duns, cage_code=cage_code)
            exclusion_data = result.get("exclusionData", [])
            return len(exclusion_data) > 0
        except SamGovError:
            return False
    
    async def get_opportunities(
        self,
        notice_id: Optional[str] = None,
        solicitation_number: Optional[str] = None,
        naics_code: Optional[str] = None,
        set_aside: Optional[str] = None,
        page: int = 0,
        size: int = 10,
    ) -> Dict[str, Any]:
        """Search for contract opportunities."""
        params = {"page": page, "size": size}
        
        if notice_id:
            params["noticeId"] = notice_id
        if solicitation_number:
            params["solNum"] = solicitation_number
        if naics_code:
            params["naicsCode"] = naics_code
        if set_aside:
            params["setAside"] = set_aside
        
        return await self._request(
            "GET",
            "/opportunities/v1/search",
            params=params
        )
    
    async def get_opportunity(self, notice_id: str) -> Optional[Dict[str, Any]]:
        """Get opportunity details by notice ID."""
        try:
            result = await self.get_opportunities(notice_id=notice_id, size=1)
            opportunities = result.get("opportunitiesData", [])
            return opportunities[0] if opportunities else None
        except SamGovError:
            return None
    
    def parse_entity_data(self, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse SAM.gov entity data into our format."""
        entity_registration = entity_data.get("entityRegistration", {})
        physical_address = entity_data.get("physicalAddress", {})
        
        return {
            "samUei": entity_registration.get("ueiSAM"),
            "legalBusinessName": entity_registration.get("legalBusinessName"),
            "dbaName": entity_registration.get("dbaName"),
            "cageCode": entity_registration.get("cageCode"),
            "registrationStatus": entity_registration.get("registrationStatus"),
            "registrationDate": entity_registration.get("registrationDate"),
            "expirationDate": entity_registration.get("expirationDate"),
            "physicalAddress": {
                "street": physical_address.get("addressLine1", ""),
                "city": physical_address.get("city", ""),
                "state": physical_address.get("stateOrProvinceCode", ""),
                "zipCode": physical_address.get("zipCode", ""),
                "country": physical_address.get("countryCode", "USA"),
            },
            "businessTypes": entity_data.get("businessTypes", []),
            "naicsCodes": [
                {
                    "code": nc.get("naicsCode"),
                    "description": nc.get("naicsDescription"),
                    "isPrimary": nc.get("isPrimary") == "Yes",
                }
                for nc in entity_data.get("naics", [])
            ],
        }
    
    async def close(self):
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()


@lru_cache()
def get_samgov_service() -> SamGovService:
    """Get cached SAM.gov service instance."""
    return SamGovService()
