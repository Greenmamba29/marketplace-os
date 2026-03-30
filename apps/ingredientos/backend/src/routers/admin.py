"""
Admin router for platform management
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query

from ..models.common import ApiResponse
from ..models.auth import User
from ..routers.auth import require_admin

router = APIRouter()


@router.get("/stats", response_model=ApiResponse[dict])
async def get_platform_stats(current_user: User = Depends(require_admin)):
    """Get platform statistics"""
    stats = {
        "total_users": 1247,
        "total_suppliers": 89,
        "total_ingredients": 2543,
        "total_orders": 3847,
        "gmv": 4850000,
        "pending_verifications": 23,
        "compliance_alerts": 7,
        "active_rfqs": 156,
        "quotes_submitted_this_month": 892,
    }
    
    return ApiResponse(success=True, data=stats)


@router.get("/verifications/pending", response_model=ApiResponse[dict])
async def get_pending_verifications(current_user: User = Depends(require_admin)):
    """Get all pending verifications"""
    verifications = {
        "ingredients": [
            {
                "id": "V-002",
                "name": "Novel Plant Protein Isolate",
                "supplier": "ProteinTech Labs",
                "submitted_at": "2024-01-14",
                "documents": 8,
                "status": "pending_review",
            },
        ],
        "suppliers": [
            {
                "id": "V-001",
                "name": "GreenLeaf Extracts Co.",
                "submitted_at": "2024-01-15",
                "documents": 5,
                "status": "pending_review",
            },
        ],
        "certifications": [
            {
                "id": "V-003",
                "name": "Organic Certification Renewal",
                "supplier": "PureSweet Naturals",
                "submitted_at": "2024-01-13",
                "documents": 3,
                "status": "documents_incomplete",
            },
        ],
    }
    
    return ApiResponse(success=True, data=verifications)


@router.post("/ingredients/{ingredient_id}/verify")
async def verify_ingredient(
    ingredient_id: str,
    current_user: User = Depends(require_admin),
):
    """Verify an ingredient"""
    return ApiResponse(
        success=True,
        data={"ingredient_id": ingredient_id, "verified": True},
        message="Ingredient verified successfully",
    )


@router.post("/suppliers/{supplier_id}/verify")
async def verify_supplier(
    supplier_id: str,
    current_user: User = Depends(require_admin),
):
    """Verify a supplier"""
    return ApiResponse(
        success=True,
        data={"supplier_id": supplier_id, "verified": True},
        message="Supplier verified successfully",
    )


@router.get("/compliance/alerts", response_model=ApiResponse[List[dict]])
async def get_compliance_alerts(current_user: User = Depends(require_admin)):
    """Get compliance alerts"""
    alerts = [
        {
            "id": "A-001",
            "severity": "high",
            "type": "certification_expiry",
            "message": "Kosher certification expires in 15 days",
            "entity": "FlavorCraft International",
            "action_required": "Request renewal documentation",
        },
        {
            "id": "A-002",
            "severity": "medium",
            "type": "gras_update",
            "message": "FDA issued questions on GRN-000928",
            "entity": "Hemp Extract Supplier",
            "action_required": "Notify supplier",
        },
        {
            "id": "A-003",
            "severity": "low",
            "type": "coa_missing",
            "message": "COA not received for recent shipment",
            "entity": "Order ORD-2024-003",
            "action_required": "Follow up with supplier",
        },
    ]
    
    return ApiResponse(success=True, data=alerts)


@router.get("/users", response_model=ApiResponse[dict])
async def get_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
):
    """Get all platform users"""
    users = [
        {
            "id": "U-001",
            "name": "John Smith",
            "email": "john@foodco.com",
            "company": "FoodCo Inc.",
            "role": "buyer",
            "status": "active",
            "joined": "2024-01-15",
        },
        {
            "id": "U-002",
            "name": "Sarah Johnson",
            "email": "sarah@naturals.com",
            "company": "Naturals LLC",
            "role": "supplier",
            "status": "pending",
            "joined": "2024-01-14",
        },
        {
            "id": "U-003",
            "name": "Mike Chen",
            "email": "mike@proteins.com",
            "company": "ProteinTech",
            "role": "supplier",
            "status": "active",
            "joined": "2024-01-13",
        },
    ]
    
    return ApiResponse(
        success=True,
        data={
            "users": users,
            "total": 1247,
            "page": page,
            "per_page": per_page,
        },
    )


@router.get("/dashboard/buyer/stats", response_model=ApiResponse[dict])
async def get_buyer_dashboard_stats(current_user: User = Depends(require_admin)):
    """Get buyer dashboard statistics"""
    stats = {
        "total_orders": 47,
        "active_rfqs": 3,
        "pending_quotes": 8,
        "total_spent": 125750,
        "savings_vs_traditional": 18500,
        "average_order_value": 2675,
        "supplier_count": 12,
        "on_time_delivery_rate": 96,
    }
    
    return ApiResponse(success=True, data=stats)


@router.get("/dashboard/supplier/stats", response_model=ApiResponse[dict])
async def get_supplier_dashboard_stats(current_user: User = Depends(require_admin)):
    """Get supplier dashboard statistics"""
    stats = {
        "total_quotes_submitted": 156,
        "quote_win_rate": 24.5,
        "active_orders": 12,
        "total_revenue": 485000,
        "pending_rfqs": 23,
        "average_response_time_hours": 18,
        "customer_rating": 4.7,
    }
    
    return ApiResponse(success=True, data=stats)


@router.get("/audit-log", response_model=ApiResponse[List[dict]])
async def get_audit_log(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
):
    """Get platform audit log"""
    logs = [
        {
            "id": "log_001",
            "action": "ingredient_created",
            "user_id": "U-001",
            "user_name": "John Smith",
            "entity_type": "ingredient",
            "entity_id": "ing_001",
            "details": "Created new ingredient: Organic Stevia Extract",
            "timestamp": "2024-01-15T10:30:00Z",
        },
        {
            "id": "log_002",
            "action": "rfq_published",
            "user_id": "U-002",
            "user_name": "Sarah Johnson",
            "entity_type": "rfq",
            "entity_id": "rfq_001",
            "details": "Published RFQ for Organic Sweetener",
            "timestamp": "2024-01-15T09:15:00Z",
        },
    ]
    
    return ApiResponse(success=True, data=logs)
