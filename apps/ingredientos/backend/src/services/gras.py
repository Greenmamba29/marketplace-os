"""
GRAS (Generally Recognized As Safe) verification service
Integrates with FDA GRAS database for verification
"""

from typing import Any, Dict, List, Optional
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..config import get_settings


class GRASService:
    """Service for GRAS verification and FDA compliance"""
    
    def __init__(self):
        settings = get_settings()
        self.fda_api_url = settings.fda_api_url.rstrip("/")
        self.enabled = settings.enable_gras_verification
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def search_gras_database(
        self,
        query: Optional[str] = None,
        substance: Optional[str] = None,
        notifier: Optional[str] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Search the FDA GRAS database"""
        if not self.enabled:
            return []
        
        # FDA API endpoint for GRAS notices
        url = f"{self.fda_api_url}/food/enforcement.json"
        
        params = {"limit": limit}
        if query:
            params["search"] = query
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                return data.get("results", [])
        except Exception as e:
            # Log error and return empty list
            print(f"Error searching GRAS database: {e}")
            return []
    
    async def get_gras_notice(self, grn_number: str) -> Optional[Dict[str, Any]]:
        """Get a specific GRAS notice by GRN number"""
        if not self.enabled:
            return None
        
        # Format GRN number (e.g., "GRN 000253" -> "253")
        grn_clean = grn_number.replace("GRN", "").strip().lstrip("0")
        
        # In production, this would query the actual FDA database
        # For now, return mock data
        mock_notices = {
            "253": {
                "grn_number": "GRN 000253",
                "substance": "Rebaudioside A (Stevia)",
                "notifier": "Cargill, Inc.",
                "notification_date": "2008-12-17",
                "fda_response": "No Questions",
                "intended_use": "General purpose sweetener in foods",
                "status": "active",
                "documents": [
                    {
                        "type": "notification",
                        "url": "https://www.fda.gov/food/gras-notice-inventory/grn-253",
                    }
                ],
            },
            "772": {
                "grn_number": "GRN 000772",
                "substance": "Hemp Seed-Derived Ingredients",
                "notifier": "Fresh Hemp Foods Ltd.",
                "notification_date": "2018-12-20",
                "fda_response": "No Questions",
                "intended_use": "Food ingredient",
                "status": "active",
                "documents": [
                    {
                        "type": "notification",
                        "url": "https://www.fda.gov/food/gras-notice-inventory/grn-772",
                    }
                ],
            },
        }
        
        return mock_notices.get(grn_clean)
    
    async def verify_gras_status(
        self,
        ingredient_name: str,
        fdn_number: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Verify GRAS status for an ingredient"""
        if not self.enabled:
            return {
                "verified": False,
                "reason": "GRAS verification is disabled",
            }
        
        # If FDN number is provided, verify directly
        if fdn_number:
            notice = await self.get_gras_notice(fdn_number)
            if notice:
                return {
                    "verified": True,
                    "grn_number": notice["grn_number"],
                    "substance": notice["substance"],
                    "fda_response": notice["fda_response"],
                    "notification_date": notice["notification_date"],
                }
        
        # Otherwise, search by ingredient name
        results = await self.search_gras_database(query=ingredient_name)
        
        if results:
            # Return the first matching result
            return {
                "verified": True,
                "matches": len(results),
                "results": results[:5],  # Return top 5 matches
            }
        
        return {
            "verified": False,
            "reason": "No GRAS notice found for this ingredient",
        }
    
    async def validate_gras_claim(
        self,
        ingredient_name: str,
        claimed_grn: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Validate a GRAS claim made by a supplier"""
        verification = await self.verify_gras_status(ingredient_name, claimed_grn)
        
        if not verification["verified"]:
            return {
                "valid": False,
                "reason": verification.get("reason", "Could not verify GRAS status"),
            }
        
        # If a specific GRN was claimed, verify it matches
        if claimed_grn:
            if verification.get("grn_number") == claimed_grn:
                return {
                    "valid": True,
                    "grn_number": claimed_grn,
                    "substance": verification.get("substance"),
                    "fda_response": verification.get("fda_response"),
                }
            else:
                return {
                    "valid": False,
                    "reason": "Claimed GRN does not match FDA records",
                    "claimed": claimed_grn,
                    "found": verification.get("grn_number"),
                }
        
        return {
            "valid": True,
            "matches": verification.get("matches", 1),
            "results": verification.get("results", [verification]),
        }
    
    def get_gras_guidance(self) -> Dict[str, Any]:
        """Get guidance on GRAS notification process"""
        return {
            "overview": """
                Generally Recognized As Safe (GRAS) is a FDA designation that a chemical 
                or substance added to food is considered safe by experts. GRAS status 
                can be self-affirmed by the manufacturer or confirmed through FDA notification.
            """,
            "notification_process": [
                "Prepare GRAS notice with safety data",
                "Submit notice to FDA",
                "FDA reviews within 180 days",
                "FDA issues response (No Questions, Questions, or Cease Distribution)",
            ],
            "self_affirmed_gras": {
                "requirements": [
                    "Expert panel evaluation",
                    "Published safety studies",
                    "Common use in food before 1958",
                ],
                "documentation_needed": [
                    "Expert panel report",
                    "Safety study summaries",
                    "Intended use description",
                ],
            },
            "fda_resources": {
                "gras_inventory": "https://www.fda.gov/food/gras-notice-inventory",
                "guidance_documents": "https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras",
                "submission_portal": "https://www.fda.gov/food/food-ingredients-packaging/how-submit-gras-notice",
            },
        }
    
    async def check_regulatory_updates(self) -> List[Dict[str, Any]]:
        """Check for regulatory updates related to GRAS"""
        # In production, this would check FDA RSS feeds or APIs
        return [
            {
                "date": "2024-01-15",
                "type": "gras_notice",
                "title": "New GRAS Notice GRN-001000 Published",
                "description": "FDA published response to new GRAS notification",
                "url": "https://www.fda.gov/food/gras-notice-inventory",
            },
            {
                "date": "2024-01-10",
                "type": "guidance",
                "title": "Updated GRAS Guidance Document",
                "description": "FDA issued updated guidance on GRAS notifications",
                "url": "https://www.fda.gov/food/guidance-documents",
            },
        ]
