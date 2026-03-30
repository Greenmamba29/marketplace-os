"""Compliance service for regulatory checks."""

from typing import Any, Dict, List, Optional

from src.config import EPA_STATUSES, REACH_STATUSES, TSCA_STATUSES
from src.services.baserow import get_baserow_service


class ComplianceService:
    """Service for compliance and regulatory operations."""
    
    def __init__(self):
        self.baserow = get_baserow_service()
    
    async def get_compliance_by_cas(
        self,
        cas_number: str,
    ) -> Optional[Dict[str, Any]]:
        """Get compliance record by CAS number."""
        results = await self.baserow.list_rows(
            "COMPLIANCE_REGISTRY",
            filters={"cas_number__equal": cas_number},
        )
        
        if results.get("results"):
            return results["results"][0]
        return None
    
    async def validate_cas_number(self, cas_number: str) -> Dict[str, Any]:
        """Validate CAS number format and checksum."""
        # Remove any whitespace
        cas = cas_number.strip()
        
        # Check format
        import re
        if not re.match(r"^\d{2,7}-\d{2}-\d$", cas):
            return {
                "valid": False,
                "normalized": cas,
                "checksum_valid": False,
                "error": "Invalid CAS number format",
            }
        
        # Validate checksum
        parts = cas.replace("-", "")
        check_digit = int(parts[-1])
        digits = parts[:-1]
        
        total = 0
        for i, digit in enumerate(reversed(digits)):
            total += int(digit) * (i + 1)
        
        checksum_valid = (total % 10) == check_digit
        
        return {
            "valid": True,
            "normalized": cas,
            "checksum_valid": checksum_valid,
        }
    
    async def get_regulatory_alerts(
        self,
        cas_numbers: Optional[List[str]] = None,
        severity: Optional[str] = None,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Get regulatory alerts."""
        filters = {}
        
        if severity:
            filters["severity__equal"] = severity
        
        if cas_numbers:
            # Search for alerts affecting any of the CAS numbers
            filters["cas_numbers__contains"] = cas_numbers[0]
        
        results = await self.baserow.list_rows(
            "REGULATORY_ALERTS",
            filters=filters if filters else None,
            size=limit,
            order_by="-created_at",
        )
        
        return results.get("results", [])
    
    async def get_compliance_reports(
        self,
        cas_number: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Get compliance reports for a chemical."""
        results = await self.baserow.list_rows(
            "COMPLIANCE_REPORTS",
            filters={"cas_number__equal": cas_number},
            size=limit,
            order_by="-created_at",
        )
        
        return results.get("results", [])
    
    async def create_compliance_report(
        self,
        cas_number: str,
        chemical_name: str,
        report_type: str,
        content: str,
        key_findings: List[str],
        risk_level: str,
        recommendations: List[str],
        valid_until: str,
    ) -> Dict[str, Any]:
        """Create a new compliance report."""
        data = {
            "cas_number": cas_number,
            "chemical_name": chemical_name,
            "report_type": report_type,
            "generated_by": "ai",
            "content": content,
            "key_findings": key_findings,
            "risk_level": risk_level,
            "recommendations": recommendations,
            "valid_until": valid_until,
        }
        
        return await self.baserow.create_row("COMPLIANCE_REPORTS", data)
    
    async def compare_regional_compliance(
        self,
        cas_number: str,
    ) -> Dict[str, Any]:
        """Compare compliance status across regions."""
        # This would typically query multiple regulatory databases
        # For now, return mock data structure
        return {
            "regions": [
                {"region": "EU", "status": "approved", "notes": "REACH registered"},
                {"region": "US", "status": "approved", "notes": "TSCA listed"},
                {"region": "China", "status": "restricted", "notes": "Import license required"},
                {"region": "Japan", "status": "approved", "notes": "CSCL compliant"},
            ]
        }
    
    async def analyze_compliance_risk(
        self,
        cas_number: str,
    ) -> Dict[str, Any]:
        """Analyze compliance risk for a chemical."""
        compliance = await self.get_compliance_by_cas(cas_number)
        
        if not compliance:
            return {
                "risk_level": "high",
                "factors": ["No compliance data available"],
                "recommendations": ["Request compliance verification"],
            }
        
        factors = []
        recommendations = []
        
        # Analyze REACH status
        if compliance.get("reach_status") == "pending":
            factors.append("REACH registration pending")
            recommendations.append("Verify REACH status before import to EU")
        
        # Analyze TSCA status
        if compliance.get("tsca_status") == "not_listed":
            factors.append("Not listed in TSCA inventory")
            recommendations.append("May require PMN for US import")
        
        # Analyze EPA status
        if compliance.get("epa_status") == "restricted":
            factors.append("EPA restrictions apply")
            recommendations.append("Review EPA restrictions for intended use")
        
        # Determine risk level
        risk_level = "low"
        if len(factors) >= 2:
            risk_level = "high"
        elif len(factors) == 1:
            risk_level = "medium"
        
        return {
            "risk_level": risk_level,
            "factors": factors,
            "recommendations": recommendations,
        }


# Singleton instance
_compliance_service: Optional[ComplianceService] = None


def get_compliance_service() -> ComplianceService:
    """Get or create Compliance service singleton."""
    global _compliance_service
    if _compliance_service is None:
        _compliance_service = ComplianceService()
    return _compliance_service
