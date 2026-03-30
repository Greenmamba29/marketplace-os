"""Claude AI service for intelligent features."""

import json
from typing import Any, Dict, List, Optional

import httpx

from src.config import get_settings


class ClaudeService:
    """Service for interacting with Anthropic Claude API."""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.ANTHROPIC_API_KEY
        self.model = self.settings.ANTHROPIC_MODEL
        self.base_url = "https://api.anthropic.com/v1"
    
    def _get_headers(self) -> Dict[str, str]:
        """Get request headers."""
        return {
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
        }
    
    async def generate_completion(
        self,
        prompt: str,
        max_tokens: int = 4096,
        temperature: float = 0.7,
    ) -> str:
        """Generate a completion using Claude."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers=self._get_headers(),
                json={
                    "model": self.model,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"]
    
    async def analyze_chemical_request(
        self,
        description: str,
        requirements: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Analyze a natural language chemical sourcing request."""
        prompt = f"""Analyze this chemical sourcing request and extract key information:

Description: {description}

Requirements: {', '.join(requirements) if requirements else 'None specified'}

Extract and return a JSON object with:
- matched_chemicals: array of objects with cas_number, name, confidence (0-1), and reason
- extracted_quantity: numeric quantity if mentioned
- extracted_unit: unit of measurement (kg, g, L, mL, etc.)
- extracted_grade: chemical grade if mentioned
- extracted_purity: minimum purity percentage if mentioned
- extracted_delivery_location: object with city and country if mentioned
- extracted_delivery_date: date if mentioned

Return only valid JSON."""
        
        response = await self.generate_completion(prompt, temperature=0.3)
        
        try:
            # Extract JSON from response
            json_start = response.find("{")
            json_end = response.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "matched_chemicals": [],
                "extracted_quantity": None,
                "extracted_unit": None,
            }
    
    async def generate_compliance_report(
        self,
        cas_number: str,
        chemical_name: str,
        report_type: str,
        compliance_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Generate an AI compliance report."""
        prompt = f"""Generate a {report_type} compliance report for:

CAS Number: {cas_number}
Chemical Name: {chemical_name}

Compliance Data: {json.dumps(compliance_data) if compliance_data else 'Not provided'}

Generate a comprehensive report with:
1. Executive summary
2. Key findings (list of 3-5 points)
3. Risk assessment (low, medium, or high)
4. Recommendations (list of 2-4 actionable items)
5. Regulatory context

Return as JSON with fields: content (full report text), key_findings (array), risk_level, recommendations (array)."""
        
        response = await self.generate_completion(prompt, temperature=0.5)
        
        try:
            json_start = response.find("{")
            json_end = response.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "content": response,
                "key_findings": ["Unable to parse structured findings"],
                "risk_level": "medium",
                "recommendations": ["Review compliance data manually"],
            }
    
    async def analyze_supply_chain_risk(
        self,
        cas_number: str,
        chemical_name: str,
        market_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Analyze supply chain risks for a chemical."""
        prompt = f"""Analyze supply chain risks for:

CAS Number: {cas_number}
Chemical Name: {chemical_name}

Market Data: {json.dumps(market_data) if market_data else 'Limited data available'}

Provide a risk analysis with:
1. Overall risk score (0-100)
2. Risk level (low, medium, high)
3. Key risk factors with impact and severity
4. Mitigation recommendations

Return as JSON with: risk_score, risk_level, factors (array), recommendations (array)."""
        
        response = await self.generate_completion(prompt, temperature=0.4)
        
        try:
            json_start = response.find("{")
            json_end = response.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "risk_score": 50,
                "risk_level": "medium",
                "factors": [],
                "recommendations": ["Conduct manual risk assessment"],
            }
    
    async def generate_price_forecast(
        self,
        cas_number: str,
        chemical_name: str,
        historical_prices: List[Dict[str, Any]],
        months: int = 6,
    ) -> Dict[str, Any]:
        """Generate a price forecast."""
        prompt = f"""Generate a {months}-month price forecast for:

CAS Number: {cas_number}
Chemical Name: {chemical_name}

Historical Prices: {json.dumps(historical_prices[-12:])}

Provide a forecast with:
1. Monthly predicted prices
2. Confidence intervals
3. Key factors influencing the forecast

Return as JSON with: forecast (array of month, predicted_price, confidence_interval), factors (array)."""
        
        response = await self.generate_completion(prompt, temperature=0.4)
        
        try:
            json_start = response.find("{")
            json_end = response.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "forecast": [],
                "factors": ["Insufficient data for forecast"],
            }


# Singleton instance
_claude_service: Optional[ClaudeService] = None


def get_claude_service() -> ClaudeService:
    """Get or create Claude service singleton."""
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service
