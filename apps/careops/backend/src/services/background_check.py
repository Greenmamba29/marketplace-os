"""Background check integration service."""

from typing import Any, Dict, Optional

import httpx
import structlog

from ..config import get_settings
from ..models.background_check import (
    BackgroundCheckProvider,
    BackgroundCheckStatus,
    CheckStatus,
)

logger = structlog.get_logger()


class BackgroundCheckService:
    """Service for managing background checks through providers."""

    def __init__(self):
        self.settings = get_settings()
        self.http_client = httpx.AsyncClient(timeout=30.0)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.http_client.aclose()

    async def initiate_check(
        self,
        caregiver_id: str,
        provider: BackgroundCheckProvider,
        caregiver_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Initiate a background check with the specified provider."""
        if provider == BackgroundCheckProvider.CHECKR:
            return await self._initiate_checkr_check(caregiver_id, caregiver_data)
        elif provider == BackgroundCheckProvider.STERLING:
            return await self._initiate_sterling_check(caregiver_id, caregiver_data)
        else:
            raise ValueError(f"Unsupported background check provider: {provider}")

    async def _initiate_checkr_check(
        self, caregiver_id: str, caregiver_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Initiate a background check with Checkr."""
        api_key = self.settings.checkr_api_key
        if not api_key:
            logger.error("checkr_api_key_not_configured")
            raise ValueError("Checkr API key not configured")

        # Prepare candidate data
        candidate_data = {
            "first_name": caregiver_data.get("first_name"),
            "last_name": caregiver_data.get("last_name"),
            "email": caregiver_data.get("email"),
            "phone": caregiver_data.get("phone"),
            "zipcode": caregiver_data.get("zipcode"),
            "dob": caregiver_data.get("date_of_birth"),
            "ssn": caregiver_data.get("ssn"),
        }

        try:
            # Create candidate
            candidate_response = await self.http_client.post(
                "https://api.checkr.com/v1/candidates",
                auth=(api_key, ""),
                data=candidate_data,
            )
            candidate_response.raise_for_status()
            candidate = candidate_response.json()

            # Create report
            report_response = await self.http_client.post(
                "https://api.checkr.com/v1/reports",
                auth=(api_key, ""),
                data={
                    "candidate_id": candidate["id"],
                    "package": "tasker_standard",  # Standard package for gig workers
                },
            )
            report_response.raise_for_status()
            report = report_response.json()

            return {
                "provider": BackgroundCheckProvider.CHECKR,
                "candidate_id": candidate["id"],
                "report_id": report["id"],
                "status": BackgroundCheckStatus.IN_PROGRESS,
                "report_url": report.get("uri"),
            }

        except httpx.HTTPStatusError as e:
            logger.error(
                "checkr_api_error",
                status_code=e.response.status_code,
                response=e.response.text,
            )
            raise

    async def _initiate_sterling_check(
        self, caregiver_id: str, caregiver_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Initiate a background check with Sterling."""
        api_key = self.settings.sterling_api_key
        if not api_key:
            logger.error("sterling_api_key_not_configured")
            raise ValueError("Sterling API key not configured")

        # Sterling API implementation would go here
        # This is a placeholder for the actual implementation
        logger.info("sterling_check_initiated", caregiver_id=caregiver_id)

        return {
            "provider": BackgroundCheckProvider.STERLING,
            "candidate_id": f"sterling_{caregiver_id}",
            "report_id": None,
            "status": BackgroundCheckStatus.IN_PROGRESS,
            "report_url": None,
        }

    async def get_check_status(
        self, provider: BackgroundCheckProvider, report_id: str
    ) -> Dict[str, Any]:
        """Get the status of a background check."""
        if provider == BackgroundCheckProvider.CHECKR:
            return await self._get_checkr_status(report_id)
        elif provider == BackgroundCheckProvider.STERLING:
            return await self._get_sterling_status(report_id)
        else:
            raise ValueError(f"Unsupported background check provider: {provider}")

    async def _get_checkr_status(self, report_id: str) -> Dict[str, Any]:
        """Get Checkr report status."""
        api_key = self.settings.checkr_api_key
        if not api_key:
            raise ValueError("Checkr API key not configured")

        try:
            response = await self.http_client.get(
                f"https://api.checkr.com/v1/reports/{report_id}",
                auth=(api_key, ""),
            )
            response.raise_for_status()
            report = response.json()

            # Map Checkr status to our status
            status_map = {
                "pending": BackgroundCheckStatus.IN_PROGRESS,
                "clear": BackgroundCheckStatus.COMPLETED,
                "consider": BackgroundCheckStatus.COMPLETED,
                "suspended": BackgroundCheckStatus.IN_PROGRESS,
                "dispute": BackgroundCheckStatus.IN_PROGRESS,
            }

            return {
                "status": status_map.get(report["status"], BackgroundCheckStatus.IN_PROGRESS),
                "result": report["status"],
                "completed_at": report.get("completed_at"),
                "package": report.get("package"),
                "checks": report.get("checks", []),
            }

        except httpx.HTTPStatusError as e:
            logger.error(
                "checkr_status_error",
                status_code=e.response.status_code,
                report_id=report_id,
            )
            raise

    async def _get_sterling_status(self, report_id: str) -> Dict[str, Any]:
        """Get Sterling report status."""
        # Placeholder for Sterling implementation
        return {
            "status": BackgroundCheckStatus.IN_PROGRESS,
            "result": None,
            "completed_at": None,
        }

    async def process_webhook(
        self, provider: BackgroundCheckProvider, payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process a webhook from a background check provider."""
        if provider == BackgroundCheckProvider.CHECKR:
            return self._process_checkr_webhook(payload)
        elif provider == BackgroundCheckProvider.STERLING:
            return self._process_sterling_webhook(payload)
        else:
            raise ValueError(f"Unsupported background check provider: {provider}")

    def _process_checkr_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process Checkr webhook payload."""
        event_type = payload.get("type", "")
        data = payload.get("data", {})

        # Verify webhook signature if configured
        webhook_secret = self.settings.checkr_webhook_secret
        if webhook_secret:
            # Signature verification logic would go here
            pass

        if "report" in event_type:
            report = data
            status_map = {
                "pending": BackgroundCheckStatus.IN_PROGRESS,
                "clear": BackgroundCheckStatus.COMPLETED,
                "consider": BackgroundCheckStatus.COMPLETED,
            }

            return {
                "event_type": event_type,
                "report_id": report.get("id"),
                "candidate_id": report.get("candidate_id"),
                "status": status_map.get(report.get("status"), BackgroundCheckStatus.IN_PROGRESS),
                "completed_at": report.get("completed_at"),
            }

        return {"event_type": event_type, "processed": True}

    def _process_sterling_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process Sterling webhook payload."""
        # Placeholder for Sterling webhook processing
        return {"event_type": payload.get("event_type"), "processed": True}

    def verify_webhook_signature(
        self, provider: BackgroundCheckProvider, payload: bytes, signature: str
    ) -> bool:
        """Verify webhook signature from provider."""
        import hmac
        import hashlib

        if provider == BackgroundCheckProvider.CHECKR:
            secret = self.settings.checkr_webhook_secret
            if not secret:
                return True  # Skip verification if no secret configured

            expected_signature = hmac.new(
                secret.encode(),
                payload,
                hashlib.sha256,
            ).hexdigest()

            return hmac.compare_digest(signature, expected_signature)

        return True
