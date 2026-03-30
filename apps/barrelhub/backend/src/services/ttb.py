"""TTB permit verification service."""

import re
from datetime import date, datetime, timedelta
from typing import Optional

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import settings
from ..models.ttb import TTBPermitVerification, TTBStatus, PermitType

logger = structlog.get_logger()


class TTBService:
    """Service for TTB permit verification."""
    
    # Permit number patterns
    DSP_PATTERN = re.compile(r'^DSP-[A-Z]{2}-\d{5,6}$')
    BWG_PATTERN = re.compile(r'^BWG-[A-Z]{2}-\d{5,6}$')
    
    def __init__(self):
        self.api_url = settings.ttb_api_url
        self.api_key = settings.ttb_api_key
        self.verify_enabled = settings.ttb_verify_enabled
        self.client = httpx.AsyncClient(
            base_url=self.api_url,
            timeout=10.0,
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    def _validate_permit_format(self, permit_number: str) -> tuple[bool, Optional[PermitType]]:
        """Validate permit number format and identify type."""
        permit_number = permit_number.upper().strip()
        
        if self.DSP_PATTERN.match(permit_number):
            return True, PermitType.DSP
        elif self.BWG_PATTERN.match(permit_number):
            return True, PermitType.BWG
        
        return False, None
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def verify_permit(self, permit_number: str) -> TTBPermitVerification:
        """Verify a TTB permit number."""
        permit_number = permit_number.upper().strip()
        
        logger.info("verifying_ttb_permit", permit_number=permit_number)
        
        # Check format
        is_valid_format, permit_type = self._validate_permit_format(permit_number)
        
        if not is_valid_format:
            return TTBPermitVerification(
                valid=False,
                permit_number=permit_number,
                message="Invalid permit number format. Expected: DSP-XX-##### or BWG-XX-#####",
            )
        
        # If verification is disabled, return mock valid response
        if not self.verify_enabled:
            logger.warning("ttb_verification_disabled", permit_number=permit_number)
            return TTBPermitVerification(
                valid=True,
                permit_number=permit_number,
                company_name="Mock Company (Verification Disabled)",
                status=TTBStatus.VERIFIED,
                expiration_date=date.today() + timedelta(days=365),
                message="Verification disabled - mock response",
            )
        
        try:
            # Call TTB API (mock implementation - replace with actual API)
            # In production, this would call the actual TTB API
            response = await self._call_ttb_api(permit_number)
            
            return TTBPermitVerification(
                valid=response.get("valid", False),
                permit_number=permit_number,
                company_name=response.get("company_name"),
                status=response.get("status"),
                expiration_date=response.get("expiration_date"),
                message=response.get("message"),
            )
            
        except Exception as e:
            logger.error(
                "ttb_verification_error",
                permit_number=permit_number,
                error=str(e),
            )
            return TTBPermitVerification(
                valid=False,
                permit_number=permit_number,
                message=f"Verification service error: {str(e)}",
            )
    
    async def _call_ttb_api(self, permit_number: str) -> dict:
        """Call TTB API for permit verification."""
        # This is a mock implementation
        # In production, replace with actual TTB API integration
        
        # Simulate API call
        logger.info("calling_ttb_api", permit_number=permit_number)
        
        # Mock response for demonstration
        return {
            "valid": True,
            "permit_number": permit_number,
            "company_name": f"Distillery {permit_number}",
            "status": TTBStatus.VERIFIED,
            "expiration_date": date.today() + timedelta(days=365),
            "message": "Permit verified successfully",
        }
    
    async def search_permits(
        self,
        query: str,
        state: Optional[str] = None,
        permit_type: Optional[PermitType] = None,
    ) -> list[dict]:
        """Search for permits."""
        logger.info(
            "searching_ttb_permits",
            query=query,
            state=state,
            permit_type=permit_type,
        )
        
        # Mock search results
        return [
            {
                "permit_number": "DSP-KY-12345",
                "company_name": "Kentucky Bourbon Distillers",
                "permit_type": PermitType.DSP,
                "status": TTBStatus.VERIFIED,
                "city": "Louisville",
                "state": "KY",
            },
            {
                "permit_number": "DSP-TN-67890",
                "company_name": "Tennessee Whiskey Co.",
                "permit_type": PermitType.DSP,
                "status": TTBStatus.VERIFIED,
                "city": "Nashville",
                "state": "TN",
            },
        ]
    
    def is_permit_active(self, expiration_date: Optional[date]) -> bool:
        """Check if a permit is active based on expiration date."""
        if expiration_date is None:
            return True
        return expiration_date >= date.today()


# Singleton instance
_ttb_service: Optional[TTBService] = None


def get_ttb_service() -> TTBService:
    """Get or create TTB service instance."""
    global _ttb_service
    if _ttb_service is None:
        _ttb_service = TTBService()
    return _ttb_service
