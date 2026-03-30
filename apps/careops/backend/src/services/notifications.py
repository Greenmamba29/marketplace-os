"""Notification service for email and SMS."""

from typing import Any, Dict, List, Optional

import httpx
import structlog

from ..config import get_settings

logger = structlog.get_logger()


class NotificationService:
    """Service for sending notifications via email and SMS."""

    def __init__(self):
        self.settings = get_settings()
        self.http_client = httpx.AsyncClient(timeout=30.0)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.http_client.aclose()

    async def send_email(
        self,
        to_email: str,
        subject: str,
        template_id: str,
        template_data: Dict[str, Any],
    ) -> bool:
        """Send an email using SendGrid."""
        api_key = self.settings.sendgrid_api_key
        if not api_key:
            logger.warning("sendgrid_api_key_not_configured", to_email=to_email)
            return False

        try:
            response = await self.http_client.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "personalizations": [
                        {
                            "to": [{"email": to_email}],
                            "dynamic_template_data": template_data,
                        }
                    ],
                    "from": {"email": "noreply@careops.io", "name": "CareOps"},
                    "template_id": template_id,
                },
            )
            response.raise_for_status()
            logger.info("email_sent", to_email=to_email, template_id=template_id)
            return True

        except httpx.HTTPStatusError as e:
            logger.error(
                "sendgrid_api_error",
                status_code=e.response.status_code,
                to_email=to_email,
            )
            return False

    async def send_sms(
        self,
        to_phone: str,
        message: str,
    ) -> bool:
        """Send an SMS using Twilio."""
        account_sid = self.settings.twilio_account_sid
        auth_token = self.settings.twilio_auth_token
        from_number = self.settings.twilio_phone_number

        if not all([account_sid, auth_token, from_number]):
            logger.warning("twilio_not_configured", to_phone=to_phone)
            return False

        try:
            response = await self.http_client.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
                auth=(account_sid, auth_token),
                data={
                    "From": from_number,
                    "To": to_phone,
                    "Body": message,
                },
            )
            response.raise_for_status()
            logger.info("sms_sent", to_phone=to_phone)
            return True

        except httpx.HTTPStatusError as e:
            logger.error(
                "twilio_api_error",
                status_code=e.response.status_code,
                to_phone=to_phone,
            )
            return False

    async def notify_caregiver_assigned(
        self,
        caregiver_email: str,
        caregiver_phone: Optional[str],
        care_plan_data: Dict[str, Any],
    ) -> None:
        """Notify caregiver of new assignment."""
        # Send email notification
        await self.send_email(
            to_email=caregiver_email,
            subject="New Care Assignment",
            template_id="d-caregiver-assigned",  # SendGrid template ID
            template_data={
                "patient_name": care_plan_data.get("patient_name"),
                "care_type": care_plan_data.get("care_type"),
                "start_date": care_plan_data.get("schedule_requirements", {}).get("start_date"),
                "caregiver_name": care_plan_data.get("caregiver_name"),
            },
        )

        # Send SMS if phone available
        if caregiver_phone:
            await self.send_sms(
                to_phone=caregiver_phone,
                message=f"CareOps: You've been assigned to care for {care_plan_data.get('patient_name')}. Check your email for details.",
            )

    async def notify_shift_reminder(
        self,
        caregiver_email: str,
        caregiver_phone: Optional[str],
        shift_data: Dict[str, Any],
    ) -> None:
        """Send shift reminder to caregiver."""
        await self.send_email(
            to_email=caregiver_email,
            subject="Upcoming Shift Reminder",
            template_id="d-shift-reminder",
            template_data={
                "patient_name": shift_data.get("patient_name"),
                "shift_date": shift_data.get("scheduled_date"),
                "start_time": shift_data.get("start_time"),
                "address": shift_data.get("address"),
            },
        )

        if caregiver_phone:
            await self.send_sms(
                to_phone=caregiver_phone,
                message=f"CareOps Reminder: Shift tomorrow at {shift_data.get('start_time')} for {shift_data.get('patient_name')}",
            )

    async def notify_family_care_update(
        self,
        family_email: str,
        update_data: Dict[str, Any],
    ) -> None:
        """Notify family of care update."""
        await self.send_email(
            to_email=family_email,
            subject="Care Update",
            template_id="d-care-update",
            template_data={
                "patient_name": update_data.get("patient_name"),
                "caregiver_name": update_data.get("caregiver_name"),
                "update_type": update_data.get("update_type"),
                "message": update_data.get("message"),
            },
        )

    async def notify_background_check_complete(
        self,
        caregiver_email: str,
        status: str,
    ) -> None:
        """Notify caregiver of background check completion."""
        await self.send_email(
            to_email=caregiver_email,
            subject="Background Check Complete",
            template_id="d-bg-check-complete",
            template_data={
                "status": status,
                "next_steps": "You can now start accepting care assignments." if status == "clear" else "Please contact support for more information.",
            },
        )

    async def notify_admin_pending_approval(
        self, item_type: str, item_id: str, details: Dict[str, Any]
    ) -> None:
        """Notify admin of pending approval item."""
        # This would typically send to an admin distribution list
        admin_email = "admin@careops.io"
        await self.send_email(
            to_email=admin_email,
            subject=f"Pending {item_type.title()} Approval",
            template_id="d-admin-pending",
            template_data={
                "item_type": item_type,
                "item_id": item_id,
                "details": details,
            },
        )
