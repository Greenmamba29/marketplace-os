"""Baserow integration service."""

from typing import Any, Dict, List, Optional

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings

logger = structlog.get_logger()


class BaserowService:
    """Service for interacting with Baserow API."""

    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.baserow_api_url.rstrip("/")
        self.token = self.settings.baserow_api_token
        self.headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
        self.client = httpx.AsyncClient(headers=self.headers, timeout=30.0)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make an HTTP request to Baserow API."""
        url = f"{self.base_url}/api/database/rows/table/{endpoint}"

        # Always use user_field_names for better readability
        if params is None:
            params = {}
        params["user_field_names"] = "true"

        try:
            response = await self.client.request(
                method=method,
                url=url,
                params=params,
                json=json_data,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(
                "baserow_http_error",
                status_code=e.response.status_code,
                response=e.response.text,
                url=str(e.request.url),
            )
            raise
        except Exception as e:
            logger.error("baserow_request_error", error=str(e))
            raise

    async def health_check(self) -> bool:
        """Check Baserow API health."""
        try:
            response = await self.client.get(f"{self.base_url}/api/_health/")
            return response.status_code == 200
        except Exception as e:
            logger.error("baserow_health_check_failed", error=str(e))
            return False

    # User Operations
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        table_id = self.settings.baserow_users_table_id
        if not table_id:
            logger.error("users_table_id_not_configured")
            return None

        try:
            result = await self._request("GET", f"{table_id}/{user_id}/")
            return result
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        table_id = self.settings.baserow_users_table_id
        if not table_id:
            return None

        result = await self._request(
            "GET",
            f"{table_id}/",
            params={"filter__email__equal": email},
        )
        results = result.get("results", [])
        return results[0] if results else None

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user."""
        table_id = self.settings.baserow_users_table_id
        if not table_id:
            raise ValueError("Users table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=user_data)

    async def update_user(
        self, user_id: str, user_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update user."""
        table_id = self.settings.baserow_users_table_id
        if not table_id:
            raise ValueError("Users table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{user_id}/", json_data=user_data
        )

    # Caregiver Operations
    async def get_caregiver(self, caregiver_id: str) -> Optional[Dict[str, Any]]:
        """Get caregiver by ID."""
        table_id = self.settings.baserow_caregivers_table_id
        if not table_id:
            return None

        try:
            return await self._request("GET", f"{table_id}/{caregiver_id}/")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise

    async def get_caregiver_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get caregiver by user ID."""
        table_id = self.settings.baserow_caregivers_table_id
        if not table_id:
            return None

        result = await self._request(
            "GET",
            f"{table_id}/",
            params={"filter__user_id__equal": user_id},
        )
        results = result.get("results", [])
        return results[0] if results else None

    async def search_caregivers(
        self,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Search caregivers with filters."""
        table_id = self.settings.baserow_caregivers_table_id
        if not table_id:
            return {"results": [], "count": 0}

        params: Dict[str, Any] = {"page": page, "size": per_page}

        if filters:
            # Add filter parameters
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}"] = value

        return await self._request("GET", f"{table_id}/", params=params)

    async def create_caregiver(
        self, caregiver_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new caregiver profile."""
        table_id = self.settings.baserow_caregivers_table_id
        if not table_id:
            raise ValueError("Caregivers table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=caregiver_data)

    async def update_caregiver(
        self, caregiver_id: str, caregiver_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update caregiver profile."""
        table_id = self.settings.baserow_caregivers_table_id
        if not table_id:
            raise ValueError("Caregivers table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{caregiver_id}/", json_data=caregiver_data
        )

    # Care Plan Operations
    async def get_care_plan(self, care_plan_id: str) -> Optional[Dict[str, Any]]:
        """Get care plan by ID."""
        table_id = self.settings.baserow_care_plans_table_id
        if not table_id:
            return None

        try:
            return await self._request("GET", f"{table_id}/{care_plan_id}/")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise

    async def get_care_plans_by_family(
        self, family_id: str, page: int = 1, per_page: int = 20
    ) -> Dict[str, Any]:
        """Get care plans by family ID."""
        table_id = self.settings.baserow_care_plans_table_id
        if not table_id:
            return {"results": [], "count": 0}

        return await self._request(
            "GET",
            f"{table_id}/",
            params={
                "filter__family_id__equal": family_id,
                "page": page,
                "size": per_page,
            },
        )

    async def create_care_plan(
        self, care_plan_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new care plan."""
        table_id = self.settings.baserow_care_plans_table_id
        if not table_id:
            raise ValueError("Care plans table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=care_plan_data)

    async def update_care_plan(
        self, care_plan_id: str, care_plan_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update care plan."""
        table_id = self.settings.baserow_care_plans_table_id
        if not table_id:
            raise ValueError("Care plans table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{care_plan_id}/", json_data=care_plan_data
        )

    # Schedule Operations
    async def get_shifts(
        self,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Get shifts with filters."""
        table_id = self.settings.baserow_schedules_table_id
        if not table_id:
            return {"results": [], "count": 0}

        params: Dict[str, Any] = {"page": page, "size": per_page}
        if filters:
            for key, value in filters.items():
                if value is not None:
                    params[f"filter__{key}__equal"] = value

        return await self._request("GET", f"{table_id}/", params=params)

    async def create_shift(self, shift_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new shift."""
        table_id = self.settings.baserow_schedules_table_id
        if not table_id:
            raise ValueError("Schedules table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=shift_data)

    async def update_shift(
        self, shift_id: str, shift_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update shift."""
        table_id = self.settings.baserow_schedules_table_id
        if not table_id:
            raise ValueError("Schedules table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{shift_id}/", json_data=shift_data
        )

    # Background Check Operations
    async def get_background_check(
        self, caregiver_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get background check by caregiver ID."""
        table_id = self.settings.baserow_background_checks_table_id
        if not table_id:
            return None

        result = await self._request(
            "GET",
            f"{table_id}/",
            params={"filter__caregiver_id__equal": caregiver_id},
        )
        results = result.get("results", [])
        return results[0] if results else None

    async def create_background_check(
        self, check_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new background check."""
        table_id = self.settings.baserow_background_checks_table_id
        if not table_id:
            raise ValueError("Background checks table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=check_data)

    async def update_background_check(
        self, check_id: str, check_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update background check."""
        table_id = self.settings.baserow_background_checks_table_id
        if not table_id:
            raise ValueError("Background checks table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{check_id}/", json_data=check_data
        )

    # Payer Authorization Operations
    async def get_payer_authorizations(
        self,
        care_plan_id: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Get payer authorizations."""
        table_id = self.settings.baserow_payer_auths_table_id
        if not table_id:
            return {"results": [], "count": 0}

        params: Dict[str, Any] = {"page": page, "size": per_page}
        if care_plan_id:
            params["filter__care_plan_id__equal"] = care_plan_id

        return await self._request("GET", f"{table_id}/", params=params)

    async def create_payer_authorization(
        self, auth_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new payer authorization."""
        table_id = self.settings.baserow_payer_auths_table_id
        if not table_id:
            raise ValueError("Payer authorizations table ID not configured")

        return await self._request("POST", f"{table_id}/", json_data=auth_data)

    async def update_payer_authorization(
        self, auth_id: str, auth_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update payer authorization."""
        table_id = self.settings.baserow_payer_auths_table_id
        if not table_id:
            raise ValueError("Payer authorizations table ID not configured")

        return await self._request(
            "PATCH", f"{table_id}/{auth_id}/", json_data=auth_data
        )
