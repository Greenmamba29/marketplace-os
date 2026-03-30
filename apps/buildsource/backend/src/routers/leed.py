"""LEED tracking router."""

from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

from models.leed import (
    LEEDTracking,
    LEEDCreditDetail,
    LEEDMaterialsResponse,
    RecycledContentSummary,
    RegionalMaterialsSummary,
    MRCalculationResult,
    LEEDDocumentationRequest,
    LEEDDocumentationResponse,
)
from models.common import ApiResponse
from services.baserow import get_baserow_service
from services.leed import get_leed_service

router = APIRouter(prefix="/leed", tags=["LEED"])
security = HTTPBearer()


@router.get("/project/{project_id}", response_model=ApiResponse[LEEDTracking])
async def get_leed_tracking(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[LEEDTracking]:
    """Get LEED tracking for a project."""
    result = await baserow.list_rows(
        "leed_tracking",
        filters={"project_id": project_id},
        size=1,
    )
    
    rows = result.get("results", [])
    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="LEED tracking not found for this project",
        )
    
    return ApiResponse.success_response(LEEDTracking(**rows[0]))


@router.get("/project/{project_id}/materials", response_model=ApiResponse[LEEDMaterialsResponse])
async def get_project_leed_materials(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[LEEDMaterialsResponse]:
    """Get LEED-eligible materials for a project."""
    # Get project materials
    materials_result = await baserow.list_rows(
        "project_materials",
        filters={"project_id": project_id},
    )
    
    materials = []
    total_contribution = 0
    
    for pm in materials_result.get("results", []):
        # Get material details
        material = await baserow.get_row("products", pm.get("material_id"))
        if material and material.get("leed_points", 0) > 0:
            # Determine LEED contributions
            contributions = []
            if material.get("recycled_content_percent", 0) > 0:
                contributions.append("MRc4 - Recycled Content")
            if material.get("regional_sourcing_radius_miles", 0) <= 100:
                contributions.append("MRc3 - Regional Materials")
            
            points = material.get("leed_points", 0)
            total_contribution += points
            
            materials.append({
                "material": material,
                "leed_contribution": contributions,
                "points_contributed": points,
            })
    
    return ApiResponse.success_response(
        LEEDMaterialsResponse(
            materials=materials,
            total_contribution=total_contribution,
        )
    )


@router.get("/credits", response_model=ApiResponse[List[dict]])
async def get_all_credits(
    leed=Depends(get_leed_service),
) -> ApiResponse[List[dict]]:
    """Get all LEED credits."""
    credits = leed.get_all_credits()
    return ApiResponse.success_response(credits)


@router.get("/credits/{credit_id}", response_model=ApiResponse[LEEDCreditDetail])
async def get_credit_details(
    credit_id: str,
    leed=Depends(get_leed_service),
) -> ApiResponse[LEEDCreditDetail]:
    """Get details for a specific LEED credit."""
    details = leed.get_credit_details(credit_id)
    if not details:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credit not found",
        )
    
    return ApiResponse.success_response(LEEDCreditDetail(**details))


@router.get("/project/{project_id}/mr-calculation", response_model=ApiResponse[MRCalculationResult])
async def calculate_mr_credits(
    project_id: str,
    leed=Depends(get_leed_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[MRCalculationResult]:
    """Calculate Materials & Resources credits for a project."""
    # Get project materials
    materials_result = await baserow.list_rows(
        "project_materials",
        filters={"project_id": project_id},
    )
    
    # Build materials list with full details
    materials = []
    for pm in materials_result.get("results", []):
        material = await baserow.get_row("products", pm.get("material_id"))
        if material:
            materials.append({
                "cost": material.get("unit_price", 0) * pm.get("quantity_required", 0),
                "recycled_percentage": material.get("recycled_content_percent", 0),
                "is_regional": material.get("regional_sourcing_radius_miles", 0) <= 100,
                "has_epd": bool(material.get("epd_url")),
                "manufacturer": material.get("manufacturer"),
            })
    
    # Calculate MR credits
    result = leed.calculate_all_mr_credits(materials)
    
    return ApiResponse.success_response(MRCalculationResult(**result))


@router.get("/project/{project_id}/recycled-content", response_model=ApiResponse[RecycledContentSummary])
async def get_recycled_content_summary(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RecycledContentSummary]:
    """Get recycled content summary for a project."""
    # Get project materials
    materials_result = await baserow.list_rows(
        "project_materials",
        filters={"project_id": project_id},
    )
    
    total_cost = 0
    recycled_value = 0
    post_consumer_value = 0
    pre_consumer_value = 0
    breakdown = []
    
    for pm in materials_result.get("results", []):
        material = await baserow.get_row("products", pm.get("material_id"))
        if not material:
            continue
        
        cost = material.get("unit_price", 0) * pm.get("quantity_required", 0)
        recycled_pct = material.get("recycled_content_percent", 0)
        item_recycled_value = cost * (recycled_pct / 100)
        
        total_cost += cost
        recycled_value += item_recycled_value
        
        # Assume 60% post-consumer, 40% pre-consumer (would be from actual data)
        post_consumer_value += item_recycled_value * 0.6
        pre_consumer_value += item_recycled_value * 0.4
        
        breakdown.append({
            "material_name": material.get("name"),
            "cost": cost,
            "recycled_percentage": recycled_pct,
            "recycled_value": item_recycled_value,
        })
    
    recycled_percentage = (recycled_value / total_cost * 100) if total_cost > 0 else 0
    
    return ApiResponse.success_response(
        RecycledContentSummary(
            total_materials_cost=total_cost,
            recycled_content_value=recycled_value,
            recycled_content_percentage=round(recycled_percentage, 1),
            post_consumer_value=round(post_consumer_value, 2),
            pre_consumer_value=round(pre_consumer_value, 2),
            materials_breakdown=breakdown,
        )
    )


@router.get("/project/{project_id}/regional-materials", response_model=ApiResponse[RegionalMaterialsSummary])
async def get_regional_materials_summary(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RegionalMaterialsSummary]:
    """Get regional materials summary for a project."""
    # Get project
    project = await baserow.get_row("projects", project_id)
    project_zip = project.get("address", {}).get("zip", "") if project else ""
    
    # Get project materials
    materials_result = await baserow.list_rows(
        "project_materials",
        filters={"project_id": project_id},
    )
    
    total_cost = 0
    regional_value = 0
    breakdown = []
    
    for pm in materials_result.get("results", []):
        material = await baserow.get_row("products", pm.get("material_id"))
        if not material:
            continue
        
        cost = material.get("unit_price", 0) * pm.get("quantity_required", 0)
        
        # Get supplier for location info
        supplier = await baserow.get_row("suppliers", material.get("supplier_id"))
        supplier_zip = supplier.get("address", {}).get("zip", "") if supplier else ""
        
        # Calculate distance (simplified)
        distance = 50  # Would calculate actual distance
        is_regional = distance <= 100
        
        total_cost += cost
        if is_regional:
            regional_value += cost
        
        breakdown.append({
            "material_name": material.get("name"),
            "cost": cost,
            "extraction_location": supplier_zip,
            "manufacturer_location": supplier_zip,
            "distance_miles": distance,
            "is_regional": is_regional,
        })
    
    regional_percentage = (regional_value / total_cost * 100) if total_cost > 0 else 0
    
    return ApiResponse.success_response(
        RegionalMaterialsSummary(
            total_materials_cost=total_cost,
            regional_materials_value=regional_value,
            regional_materials_percentage=round(regional_percentage, 1),
            materials_breakdown=breakdown,
        )
    )


@router.post("/generate-documentation", response_model=ApiResponse[LEEDDocumentationResponse])
async def generate_documentation(
    request: LEEDDocumentationRequest,
    leed=Depends(get_leed_service),
) -> ApiResponse[LEEDDocumentationResponse]:
    """Generate LEED documentation for a project."""
    # In a real implementation, this would generate PDFs
    # For now, return a mock response
    
    from datetime import datetime, timedelta
    
    return ApiResponse.success_response(
        LEEDDocumentationResponse(
            download_url=f"https://buildsource.io/api/leed/docs/{request.project_id}.pdf",
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
    )
