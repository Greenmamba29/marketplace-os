"""Projects router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.projects import (
    Project,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectMaterial,
    ProjectMaterialCreate,
    ProjectStats,
    ProjectTimeline,
)
from models.common import ApiResponse, PaginatedResponse
from services.baserow import get_baserow_service

router = APIRouter(prefix="/projects", tags=["Projects"])
security = HTTPBearer()


@router.get("", response_model=ApiResponse[PaginatedResponse[ProjectResponse]])
async def list_projects(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[ProjectResponse]]:
    """List projects for current user."""
    filters = {}
    if status:
        filters["status"] = status
    
    result = await baserow.list_rows(
        "projects",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    projects = [ProjectResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=projects,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.post("", response_model=ApiResponse[ProjectResponse])
async def create_project(
    project: ProjectCreate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectResponse]:
    """Create a new project."""
    created = await baserow.create_row("projects", project.model_dump())
    return ApiResponse.success_response(
        ProjectResponse(**created),
        message="Project created successfully",
    )


@router.get("/{project_id}", response_model=ApiResponse[ProjectResponse])
async def get_project(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectResponse]:
    """Get a single project by ID."""
    project = await baserow.get_row("projects", project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    return ApiResponse.success_response(ProjectResponse(**project))


@router.patch("/{project_id}", response_model=ApiResponse[ProjectResponse])
async def update_project(
    project_id: str,
    update: ProjectUpdate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectResponse]:
    """Update a project."""
    # Check if project exists
    existing = await baserow.get_row("projects", project_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    updated = await baserow.update_row(
        "projects",
        project_id,
        update.model_dump(exclude_unset=True),
    )
    
    return ApiResponse.success_response(
        ProjectResponse(**updated),
        message="Project updated successfully",
    )


@router.delete("/{project_id}", response_model=ApiResponse[dict])
async def delete_project(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Delete a project."""
    # Check if project exists
    existing = await baserow.get_row("projects", project_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    await baserow.delete_row("projects", project_id)
    
    return ApiResponse.success_response(
        {},
        message="Project deleted successfully",
    )


@router.get("/{project_id}/materials", response_model=ApiResponse[list[ProjectMaterial]])
async def get_project_materials(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[ProjectMaterial]]:
    """Get materials for a project."""
    materials = await baserow.get_project_materials(project_id)
    return ApiResponse.success_response(
        [ProjectMaterial(**m) for m in materials]
    )


@router.post("/{project_id}/materials", response_model=ApiResponse[ProjectMaterial])
async def add_project_material(
    project_id: str,
    material: ProjectMaterialCreate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectMaterial]:
    """Add a material to a project."""
    # Check if project exists
    existing = await baserow.get_row("projects", project_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    data = material.model_dump()
    data["project_id"] = project_id
    
    created = await baserow.create_row("project_materials", data)
    
    return ApiResponse.success_response(
        ProjectMaterial(**created),
        message="Material added to project",
    )


@router.patch("/{project_id}/materials/{material_id}", response_model=ApiResponse[ProjectMaterial])
async def update_project_material(
    project_id: str,
    material_id: str,
    update: dict,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectMaterial]:
    """Update a project material."""
    updated = await baserow.update_row(
        "project_materials",
        material_id,
        update,
    )
    
    return ApiResponse.success_response(ProjectMaterial(**updated))


@router.delete("/{project_id}/materials/{material_id}", response_model=ApiResponse[dict])
async def remove_project_material(
    project_id: str,
    material_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Remove a material from a project."""
    await baserow.delete_row("project_materials", material_id)
    
    return ApiResponse.success_response(
        {},
        message="Material removed from project",
    )


@router.get("/{project_id}/stats", response_model=ApiResponse[ProjectStats])
async def get_project_stats(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectStats]:
    """Get project statistics."""
    # Get project materials
    materials = await baserow.get_project_materials(project_id)
    
    # Calculate stats
    total_materials = len(materials)
    materials_sourced = sum(
        1 for m in materials
        if m.get("status") in ["ordered", "delivered"]
    )
    
    # Get orders for project
    orders_result = await baserow.list_rows(
        "orders",
        filters={"project_id": project_id},
    )
    orders = orders_result.get("results", [])
    
    spent_to_date = sum(
        o.get("total_amount", 0) for o in orders
    )
    
    # Calculate LEED contribution
    leed_points = sum(
        m.get("leed_contribution", 0) or 0 for m in materials
    )
    
    # Calculate recycled content average
    recycled_pcts = [
        m.get("recycled_content", 0) or 0 for m in materials
    ]
    recycled_avg = sum(recycled_pcts) / len(recycled_pcts) if recycled_pcts else 0
    
    return ApiResponse.success_response(
        ProjectStats(
            total_materials=total_materials,
            materials_sourced=materials_sourced,
            total_budget=0,  # Would get from project
            spent_to_date=spent_to_date,
            leed_points_contribution=leed_points,
            recycled_content_avg=round(recycled_avg, 1),
        )
    )


@router.get("/{project_id}/timeline", response_model=ApiResponse[ProjectTimeline])
async def get_project_timeline(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectTimeline]:
    """Get project delivery timeline."""
    # Get orders for project
    orders_result = await baserow.list_rows(
        "orders",
        filters={"project_id": project_id},
    )
    orders = orders_result.get("results", [])
    
    # Build timeline events
    deliveries = []
    for order in orders:
        # Get order items
        items_result = await baserow.list_rows(
            "order_items",
            filters={"order_id": order.get("id")},
        )
        items = items_result.get("results", [])
        
        # Get supplier name
        supplier = await baserow.get_row("suppliers", order.get("supplier_id"))
        
        deliveries.append({
            "date": order.get("delivery_date"),
            "material_name": items[0].get("description") if items else "Unknown",
            "quantity": sum(i.get("quantity", 0) for i in items),
            "supplier_name": supplier.get("company_name") if supplier else "Unknown",
            "status": order.get("status"),
        })
    
    # Sort by date
    deliveries.sort(key=lambda x: x["date"])
    
    return ApiResponse.success_response(
        ProjectTimeline(deliveries=deliveries)
    )


@router.post("/{project_id}/duplicate", response_model=ApiResponse[ProjectResponse])
async def duplicate_project(
    project_id: str,
    new_name: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[ProjectResponse]:
    """Duplicate a project."""
    # Get original project
    original = await baserow.get_row("projects", project_id)
    if not original:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Create new project
    new_project = {
        **original,
        "name": new_name,
        "project_number": f"{original.get('project_number')}-COPY",
        "status": "planning",
    }
    new_project.pop("id", None)
    new_project.pop("created_at", None)
    new_project.pop("updated_at", None)
    
    created = await baserow.create_row("projects", new_project)
    
    # Copy materials
    materials = await baserow.get_project_materials(project_id)
    for material in materials:
        material["project_id"] = created.get("id")
        material.pop("id", None)
        await baserow.create_row("project_materials", material)
    
    return ApiResponse.success_response(
        ProjectResponse(**created),
        message="Project duplicated successfully",
    )
