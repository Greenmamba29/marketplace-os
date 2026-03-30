"""
CLIA (Clinical Laboratory Improvement Amendments) Service for LabSource

Handles CLIA-waived product tracking and validation.
"""

import logging
import re
from typing import Dict, List, Optional
from functools import lru_cache
from datetime import datetime

from ..config import get_settings
from .baserow import BaserowService, get_baserow_service

logger = logging.getLogger(__name__)


class CLIAError(Exception):
    """CLIA validation error."""
    pass


class CLIAService:
    """Service for CLIA-waived product management."""
    
    def __init__(self, baserow: Optional[BaserowService] = None):
        self.settings = get_settings()
        self.baserow = baserow or get_baserow_service()
    
    async def get_waived_products(self) -> List[Dict]:
        """Get all CLIA-waived products."""
        filters = {
            "filter_type": "AND",
            "filters": [{"field": "waived", "type": "boolean", "value": "true"}]
        }
        return await self.baserow.get_clia_products(filters=filters)
    
    async def get_product(self, product_id: str) -> Optional[Dict]:
        """Get CLIA product information."""
        filters = {
            "filter_type": "AND",
            "filters": [{"field": "reagent_id", "type": "equal", "value": product_id}]
        }
        products = await self.baserow.get_clia_products(filters=filters)
        return products[0] if products else None
    
    async def validate_clia_number(self, clia_number: str) -> Dict:
        """Validate a CLIA number format and check if active.
        
        CLIA number format: 10 alphanumeric characters
        - First 2 characters: state abbreviation or "D" for DOD
        - Next 7 characters: unique identifier
        - Last character: certification type (1-9)
        """
        # Basic format validation
        pattern = r'^[A-Z]{2}\d{7}[1-9]$|^D\d{8}$'
        
        if not clia_number:
            return {
                "valid": False,
                "message": "CLIA number is required",
            }
        
        if not re.match(pattern, clia_number.upper()):
            return {
                "valid": False,
                "message": "Invalid CLIA number format. Expected: 2 letters + 7 digits + 1 digit (e.g., AB12345670)",
            }
        
        # In production, this would query the CMS CLIA database
        # For now, we simulate validation
        return {
            "valid": True,
            "message": "CLIA number format is valid",
            "clia_number": clia_number.upper(),
        }
    
    async def validate_product_use(
        self,
        product_id: str,
        lab_clia_number: str,
    ) -> Dict:
        """Validate if a CLIA product can be used by a lab.
        
        Checks:
        1. Product exists and is CLIA-waived
        2. Lab's CLIA number is valid
        3. Lab's certification level matches product requirements
        """
        # Get product information
        product = await self.get_product(product_id)
        
        if not product:
            return {
                "valid": False,
                "product_id": product_id,
                "lab_clia_number": lab_clia_number,
                "message": "Product not found in CLIA registry",
            }
        
        # Validate CLIA number
        clia_validation = await self.validate_clia_number(lab_clia_number)
        
        if not clia_validation["valid"]:
            return {
                "valid": False,
                "product_id": product_id,
                "lab_clia_number": lab_clia_number,
                "message": clia_validation["message"],
            }
        
        # Check if product is waived
        if not product.get("waived", False):
            return {
                "valid": False,
                "product_id": product_id,
                "lab_clia_number": lab_clia_number,
                "complexity": product.get("complexity", "unknown"),
                "message": f"Product complexity level ({product.get('complexity')}) requires higher CLIA certification",
                "requirements": [
                    "Certificate of Compliance (moderate complexity)",
                    "Certificate of Accreditation (high complexity)",
                ],
            }
        
        # Build requirements list
        requirements = []
        
        if product.get("qc_requirements"):
            requirements.append(f"QC Requirements: {product['qc_requirements']}")
        
        if product.get("proficiency_testing"):
            requirements.append("Proficiency testing required")
        
        return {
            "valid": True,
            "product_id": product_id,
            "lab_clia_number": lab_clia_number,
            "complexity": product.get("complexity", "waived"),
            "message": "Product can be used with CLIA Certificate of Waiver",
            "requirements": requirements,
            "intended_use": product.get("intended_use", ""),
            "limitations": product.get("limitations", []),
            "validated_at": datetime.utcnow().isoformat(),
        }
    
    async def get_product_requirements(self, product_id: str) -> Dict:
        """Get CLIA requirements for a product."""
        product = await self.get_product(product_id)
        
        if not product:
            return {
                "found": False,
                "message": "Product not found in CLIA registry",
            }
        
        complexity = product.get("complexity", "unknown")
        
        requirements = {
            "found": True,
            "product_id": product_id,
            "complexity": complexity,
            "waived": product.get("waived", False),
            "intended_use": product.get("intended_use", ""),
            "limitations": product.get("limitations", []),
        }
        
        # Add complexity-specific requirements
        if complexity == "waived":
            requirements["certification_required"] = "Certificate of Waiver"
            requirements["personnel_requirements"] = "Follow manufacturer instructions"
        elif complexity == "moderate":
            requirements["certification_required"] = "Certificate of Compliance"
            requirements["personnel_requirements"] = "Laboratory director with appropriate qualifications"
        elif complexity == "high":
            requirements["certification_required"] = "Certificate of Accreditation"
            requirements["personnel_requirements"] = "Laboratory director with doctoral degree or equivalent"
        
        if product.get("qc_requirements"):
            requirements["qc_requirements"] = product["qc_requirements"]
        
        if product.get("proficiency_testing"):
            requirements["proficiency_testing"] = "Required"
        
        return requirements
    
    async def search_products(self, query: str) -> List[Dict]:
        """Search CLIA products by name or intended use."""
        # In production, this would use Baserow search
        # For now, return all waived products and filter
        products = await self.get_waived_products()
        
        query_lower = query.lower()
        filtered = [
            p for p in products
            if query_lower in p.get("intended_use", "").lower()
            or query_lower in p.get("reagent_name", "").lower()
        ]
        
        return filtered
    
    async def register_clia_product(self, product_data: Dict) -> Dict:
        """Register a new CLIA product in the registry."""
        required_fields = ["reagent_id", "complexity", "intended_use"]
        
        for field in required_fields:
            if field not in product_data:
                raise CLIAError(f"Missing required field: {field}")
        
        # Set waived flag based on complexity
        product_data["waived"] = product_data.get("complexity") == "waived"
        product_data["created_at"] = datetime.utcnow().isoformat()
        product_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Create in Baserow
        result = await self.baserow.create_row(
            "CLIA_REGISTRY",
            product_data,
        )
        
        return result


@lru_cache()
def get_clia_service(baserow: Optional[BaserowService] = None) -> CLIAService:
    """Get cached CLIA service instance."""
    return CLIAService(baserow=baserow)
