"""Compliance router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.models.compliance import (
    ComplianceRecord,
    ComplianceReport,
    ComplianceReportRequest,
    RiskAnalysisResponse,
    RegulatoryAlert,
)
from src.models.user import User
from src.routers.auth import get_current_active_user
from src.services.baserow import get_baserow_service
from src.services.compliance import get_compliance_service
from src.services.claude import get_claude_service

router = APIRouter()


@router.get("/cas/{cas_number}", response_model=ComplianceRecord)
async def get_compliance_by_cas(
    cas_number: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get compliance record by CAS number."""
    compliance = get_compliance_service()
    
    record = await compliance.get_compliance_by_cas(cas_number)
    
    if not record:
        raise HTTPException(status_code=404, detail="Compliance record not found")
    
    return record


@router.get("/cas/{cas_number}/reports", response_model=List[ComplianceReport])
async def get_compliance_reports(
    cas_number: str,
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_active_user),
):
    """Get compliance reports for a chemical."""
    compliance = get_compliance_service()
    
    reports = await compliance.get_compliance_reports(cas_number, limit)
    
    return reports


@router.post("/ai-report", response_model=ComplianceReport)
async def generate_ai_report(
    request: ComplianceReportRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Generate an AI compliance report."""
    compliance = get_compliance_service()
    claude = get_claude_service()
    baserow = get_baserow_service()
    
    # Get existing compliance data
    existing = await compliance.get_compliance_by_cas(request.cas_number)
    
    # Get chemical info
    chemical_results = await baserow.list_rows(
        "CHEMICALS",
        filters={"cas_number__equal": request.cas_number},
    )
    
    chemical_name = "Unknown"
    if chemical_results.get("results"):
        chemical_name = chemical_results["results"][0].get("name", "Unknown")
    
    # Generate report with Claude
    report_data = await claude.generate_compliance_report(
        cas_number=request.cas_number,
        chemical_name=chemical_name,
        report_type=request.report_type,
        compliance_data=existing,
    )
    
    # Save report
    from datetime import datetime, timedelta
    
    saved_report = await compliance.create_compliance_report(
        cas_number=request.cas_number,
        chemical_name=chemical_name,
        report_type=request.report_type,
        content=report_data.get("content", ""),
        key_findings=report_data.get("key_findings", []),
        risk_level=report_data.get("risk_level", "medium"),
        recommendations=report_data.get("recommendations", []),
        valid_until=(datetime.utcnow() + timedelta(days=90)).isoformat(),
    )
    
    return saved_report


@router.post("/analyze-risk", response_model=RiskAnalysisResponse)
async def analyze_compliance_risk(
    cas_number: str,
    current_user: User = Depends(get_current_active_user),
):
    """Analyze compliance risk for a chemical."""
    compliance = get_compliance_service()
    
    analysis = await compliance.analyze_compliance_risk(cas_number)
    
    return analysis


@router.get("/compare-regions/{cas_number}")
async def compare_regional_compliance(
    cas_number: str,
    current_user: User = Depends(get_current_active_user),
):
    """Compare compliance status across regions."""
    compliance = get_compliance_service()
    
    comparison = await compliance.compare_regional_compliance(cas_number)
    
    return comparison


@router.get("/alerts", response_model=List[RegulatoryAlert])
async def get_regulatory_alerts(
    cas_number: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """Get regulatory alerts."""
    compliance = get_compliance_service()
    
    cas_numbers = [cas_number] if cas_number else None
    alerts = await compliance.get_regulatory_alerts(cas_numbers, severity, limit)
    
    return alerts


@router.get("/alerts/{cas_number}", response_model=List[RegulatoryAlert])
async def get_alerts_by_cas(
    cas_number: str,
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """Get regulatory alerts for a specific CAS number."""
    compliance = get_compliance_service()
    
    alerts = await compliance.get_regulatory_alerts([cas_number], limit=limit)
    
    return alerts


# CAS Number Lookup
@router.get("/cas/validate")
async def validate_cas_number(
    cas: str,
    current_user: User = Depends(get_current_active_user),
):
    """Validate a CAS number format and checksum."""
    compliance = get_compliance_service()
    
    result = await compliance.validate_cas_number(cas)
    
    return result


@router.get("/cas/lookup/{cas_number}")
async def lookup_cas_number(
    cas_number: str,
    current_user: User = Depends(get_current_active_user),
):
    """Lookup CAS number details."""
    baserow = get_baserow_service()
    
    results = await baserow.list_rows(
        "CHEMICALS",
        filters={"cas_number__equal": cas_number},
    )
    
    if results.get("results"):
        chemical = results["results"][0]
        return {
            "cas_number": cas_number,
            "name": chemical.get("name"),
            "synonyms": chemical.get("synonyms", []),
            "molecular_formula": chemical.get("molecular_formula"),
            "molecular_weight": chemical.get("molecular_weight"),
            "category": chemical.get("category"),
            "found": True,
        }
    
    return {
        "cas_number": cas_number,
        "found": False,
    }


@router.post("/cas/bulk-lookup")
async def bulk_lookup_cas(
    cas_numbers: List[str],
    current_user: User = Depends(get_current_active_user),
):
    """Bulk lookup CAS numbers."""
    baserow = get_baserow_service()
    
    results = []
    for cas in cas_numbers:
        chemical_results = await baserow.list_rows(
            "CHEMICALS",
            filters={"cas_number__equal": cas},
        )
        
        if chemical_results.get("results"):
            chemical = chemical_results["results"][0]
            results.append({
                "cas_number": cas,
                "found": True,
                "name": chemical.get("name"),
                "category": chemical.get("category"),
            })
        else:
            results.append({
                "cas_number": cas,
                "found": False,
            })
    
    return {"results": results}
