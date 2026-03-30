"""
Regulatory compliance router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status

from ..models.common import ApiResponse
from ..models.regulatory import Certification, GRASStatus, AllergenProfile, FunctionalClaim
from ..routers.auth import get_current_active_user, require_admin
from ..models.auth import User

router = APIRouter()


# Mock GRAS database entries
MOCK_GRAS_ENTRIES = [
    {
        "id": "gras_001",
        "ingredient_id": "ing_001",
        "status": "gras",
        "fdn_number": "GRN 000253",
        "notification_date": "2008-12-17",
        "fda_response": "no_questions",
        "self_affirmed": False,
        "safety_studies_url": "https://www.fda.gov/food/gras-notice-inventory",
    },
    {
        "id": "gras_002",
        "ingredient_id": "ing_002",
        "status": "gras",
        "self_affirmed": True,
    },
]


@router.get("/gras/{ingredient_id}", response_model=ApiResponse[GRASStatus])
async def get_gras_status(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get GRAS status for an ingredient"""
    gras = next((g for g in MOCK_GRAS_ENTRIES if g["ingredient_id"] == ingredient_id), None)
    
    if not gras:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="GRAS status not found for this ingredient",
        )
    
    return ApiResponse(success=True, data=gras)


@router.get("/certifications/{ingredient_id}", response_model=ApiResponse[List[Certification]])
async def get_certifications(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get all certifications for an ingredient"""
    certifications = [
        {
            "id": "cert_001",
            "ingredient_id": ingredient_id,
            "name": "USDA Organic",
            "type": "organic",
            "issuer": "USDA",
            "certificate_number": "ORG-2024-001",
            "issue_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "status": "active",
            "verified": True,
        },
        {
            "id": "cert_002",
            "ingredient_id": ingredient_id,
            "name": "Non-GMO Project Verified",
            "type": "non_gmo",
            "issuer": "Non-GMO Project",
            "certificate_number": "NGP-2024-456",
            "issue_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "status": "active",
            "verified": True,
        },
        {
            "id": "cert_003",
            "ingredient_id": ingredient_id,
            "name": "Kosher Certified",
            "type": "kosher",
            "issuer": "Orthodox Union",
            "certificate_number": "OU-K-7890",
            "issue_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "status": "active",
            "verified": True,
        },
    ]
    
    return ApiResponse(success=True, data=certifications)


@router.get("/allergens/{ingredient_id}", response_model=ApiResponse[AllergenProfile])
async def get_allergen_profile(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get allergen profile for an ingredient"""
    profile = {
        "id": "all_001",
        "ingredient_id": ingredient_id,
        "contains_major_allergens": False,
        "major_allergens": [],
        "may_contain": [],
        "processed_on_shared_equipment": False,
        "allergen_statement": "This product does not contain any of the major food allergens as defined by FALCPA.",
        "fda_compliant": True,
    }
    
    return ApiResponse(success=True, data=profile)


@router.get("/claims/{ingredient_id}", response_model=ApiResponse[List[FunctionalClaim]])
async def get_functional_claims(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get functional claims for an ingredient"""
    claims = [
        {
            "id": "claim_001",
            "ingredient_id": ingredient_id,
            "claim": "Zero calorie sweetener",
            "claim_type": "nutrient_content",
            "regulatory_status": "approved",
            "substantiation_documents": ["Nutritional Analysis Report"],
        },
        {
            "id": "claim_002",
            "ingredient_id": ingredient_id,
            "claim": "Natural origin",
            "claim_type": "structure_function",
            "regulatory_status": "approved",
            "substantiation_documents": ["Source Verification Certificate"],
        },
    ]
    
    return ApiResponse(success=True, data=claims)


@router.get("/documents/{ingredient_id}", response_model=ApiResponse[List[dict]])
async def get_compliance_documents(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get compliance documents for an ingredient"""
    documents = [
        {
            "id": "doc_001",
            "ingredient_id": ingredient_id,
            "document_type": "sds",
            "file_name": "sds_stevia_extract.pdf",
            "file_url": "/documents/sds_stevia_extract.pdf",
            "uploaded_by": "admin",
            "uploaded_at": "2024-01-01T00:00:00Z",
            "verified": True,
        },
        {
            "id": "doc_002",
            "ingredient_id": ingredient_id,
            "document_type": "coa",
            "file_name": "coa_template_stevia.pdf",
            "file_url": "/documents/coa_template_stevia.pdf",
            "uploaded_by": "admin",
            "uploaded_at": "2024-01-01T00:00:00Z",
            "verified": True,
        },
    ]
    
    return ApiResponse(success=True, data=documents)


@router.post("/gras/{ingredient_id}/verify")
async def verify_gras(
    ingredient_id: str,
    current_user: User = Depends(require_admin),
):
    """Verify GRAS status for an ingredient (admin only)"""
    # In production, this would query the FDA GRAS database
    return ApiResponse(
        success=True,
        data={"verified": True, "ingredient_id": ingredient_id},
        message="GRAS status verified successfully",
    )


@router.get("/gras-database/search")
async def search_gras_database(
    query: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Search the FDA GRAS database"""
    # Mock search results
    results = [
        {
            "grn_number": "GRN 000253",
            "substance": "Rebaudioside A (Stevia)",
            "notifier": "Cargill, Inc.",
            "notification_date": "2008-12-17",
            "fda_response": "No Questions",
        },
        {
            "grn_number": "GRN 000772",
            "substance": "Hemp Seed-Derived Ingredients",
            "notifier": "Fresh Hemp Foods Ltd.",
            "notification_date": "2018-12-20",
            "fda_response": "No Questions",
        },
    ]
    
    return ApiResponse(success=True, data=results)


@router.get("/certification-types", response_model=ApiResponse[List[dict]])
async def get_certification_types(
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get all available certification types"""
    types = [
        {"id": "organic", "name": "USDA Organic", "description": "USDA National Organic Program certification"},
        {"id": "non_gmo", "name": "Non-GMO Project Verified", "description": "Third-party non-GMO verification"},
        {"id": "kosher", "name": "Kosher Certified", "description": "Orthodox Union kosher certification"},
        {"id": "halal", "name": "Halal Certified", "description": "IFANCA halal certification"},
        {"id": "gras", "name": "FDA GRAS", "description": "Generally Recognized As Safe"},
        {"id": "iso22000", "name": "ISO 22000", "description": "Food safety management system"},
    ]
    
    return ApiResponse(success=True, data=types)


@router.get("/allergens-list", response_model=ApiResponse[List[dict]])
async def get_allergens_list(
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get list of major food allergens (FALCPA)"""
    allergens = [
        {"id": "milk", "name": "Milk", "fda_major": True},
        {"id": "eggs", "name": "Eggs", "fda_major": True},
        {"id": "fish", "name": "Fish", "fda_major": True},
        {"id": "crustacean_shellfish", "name": "Crustacean Shellfish", "fda_major": True},
        {"id": "tree_nuts", "name": "Tree Nuts", "fda_major": True},
        {"id": "peanuts", "name": "Peanuts", "fda_major": True},
        {"id": "wheat", "name": "Wheat", "fda_major": True},
        {"id": "soybeans", "name": "Soybeans", "fda_major": True},
        {"id": "sesame", "name": "Sesame", "fda_major": True},
    ]
    
    return ApiResponse(success=True, data=allergens)
