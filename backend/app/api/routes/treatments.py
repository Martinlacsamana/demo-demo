from fastapi import APIRouter, HTTPException
from app.models.treatment import TreatmentPlan
from app.db.mock_data import treatment_plans

router = APIRouter()

@router.get("/", response_model=list[TreatmentPlan])
def get_all_treatment_plans():
    return treatment_plans

@router.get("/{patient_id}", response_model=TreatmentPlan)
def get_treatment_plan(patient_id: str):
    if plan := next((plan for plan in treatment_plans if plan.id == patient_id), None):
        return plan
    
    raise HTTPException(status_code=404, detail="Treatment plan not found")


@router.post("/", response_model=TreatmentPlan)
async def create_treatment_plan(treatment_data: TreatmentPlan):
    # In a real app, we'd save to a database
    # For now, we'll just return the data
    return treatment_data

