from pydantic import BaseModel

class TreatmentPlan(BaseModel):
    id: str
    patientId: str
    recommendation: str
    rationale: str
    confidence: int
    dataPoints: int
    createdAt: str
    updatedAt: str  # most likely can configure this to be default like django has