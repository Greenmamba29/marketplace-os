"""Cold chain monitoring service."""

from datetime import datetime, timedelta
from typing import Dict, List, Optional

from ..config import settings
from ..models.temperature import TemperatureReading, TemperatureExcursion, TemperatureSensor


class ColdChainService:
    """Service for cold chain temperature monitoring."""
    
    # Temperature ranges for different zones
    TEMPERATURE_RANGES = {
        "frozen": {"min": -25, "max": -18},
        "refrigerated": {"min": 0, "max": 4},
        "ambient": {"min": 15, "max": 25},
    }
    
    def __init__(self):
        self.sensors: Dict[str, TemperatureSensor] = {}
        self.excursions: Dict[str, TemperatureExcursion] = {}
    
    def register_sensor(self, sensor: TemperatureSensor) -> None:
        """Register a new temperature sensor."""
        self.sensors[sensor.id] = sensor
    
    def get_sensor(self, sensor_id: str) -> Optional[TemperatureSensor]:
        """Get a sensor by ID."""
        return self.sensors.get(sensor_id)
    
    def get_all_sensors(self) -> List[TemperatureSensor]:
        """Get all registered sensors."""
        return list(self.sensors.values())
    
    def is_temperature_in_range(self, temperature: float, zone: str) -> bool:
        """Check if temperature is within acceptable range for zone."""
        if zone not in self.TEMPERATURE_RANGES:
            return True
        
        range_config = self.TEMPERATURE_RANGES[zone]
        return range_config["min"] <= temperature <= range_config["max"]
    
    def check_for_excursion(
        self,
        sensor_id: str,
        temperature: float,
        timestamp: datetime,
    ) -> Optional[TemperatureExcursion]:
        """Check if current temperature constitutes an excursion."""
        sensor = self.get_sensor(sensor_id)
        if not sensor:
            return None
        
        if self.is_temperature_in_range(temperature, sensor.temperature_zone):
            return None
        
        # Determine severity
        zone_range = self.TEMPERATURE_RANGES[sensor.temperature_zone]
        deviation = 0
        
        if temperature < zone_range["min"]:
            deviation = abs(temperature - zone_range["min"])
        else:
            deviation = abs(temperature - zone_range["max"])
        
        if deviation <= 2:
            severity = "minor"
        elif deviation <= 5:
            severity = "major"
        else:
            severity = "critical"
        
        # Create excursion record
        excursion = TemperatureExcursion(
            id=f"EXC-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            sensor_id=sensor_id,
            sensor_location=sensor.location,
            temperature_zone=sensor.temperature_zone,
            start_time=timestamp,
            min_temperature=temperature,
            max_temperature=temperature,
            severity=severity,
            status="open",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        
        self.excursions[excursion.id] = excursion
        return excursion
    
    def update_excursion(
        self,
        excursion_id: str,
        temperature: float,
        timestamp: datetime,
    ) -> Optional[TemperatureExcursion]:
        """Update an ongoing excursion with new temperature reading."""
        excursion = self.excursions.get(excursion_id)
        if not excursion:
            return None
        
        excursion.min_temperature = min(excursion.min_temperature, temperature)
        excursion.max_temperature = max(excursion.max_temperature, temperature)
        excursion.duration = int((timestamp - excursion.start_time).total_seconds() / 60)
        excursion.updated_at = datetime.utcnow()
        
        return excursion
    
    def resolve_excursion(
        self,
        excursion_id: str,
        corrective_action: str,
        investigated_by: str,
    ) -> Optional[TemperatureExcursion]:
        """Resolve a temperature excursion."""
        excursion = self.excursions.get(excursion_id)
        if not excursion:
            return None
        
        excursion.status = "resolved"
        excursion.corrective_action = corrective_action
        excursion.investigated_by = investigated_by
        excursion.updated_at = datetime.utcnow()
        
        return excursion
    
    def get_active_excursions(self) -> List[TemperatureExcursion]:
        """Get all active (unresolved) excursions."""
        return [
            exc for exc in self.excursions.values()
            if exc.status != "resolved"
        ]
    
    def get_excursions_for_lot(self, lot_id: str) -> List[TemperatureExcursion]:
        """Get all excursions affecting a specific lot."""
        return [
            exc for exc in self.excursions.values()
            if exc.affected_lots and lot_id in exc.affected_lots
        ]
    
    def get_compliance_score(self, days: int = 30) -> float:
        """Calculate temperature compliance score."""
        # This would calculate based on actual readings
        # For now, return a mock score
        return 99.7


# Global service instance
coldchain_service = ColdChainService()
