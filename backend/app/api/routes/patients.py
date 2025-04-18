from fastapi import APIRouter, HTTPException
from app.models.patient import Patient
from app.db.mock_data import patients

router = APIRouter()

@router.get("/", response_model=list[Patient])
async def get_patients():
    return patients

@router.post("/", response_model=Patient)   # Not integrated but just for practice
def add_patient(patient: Patient):
    patients.append(patient)
    return patient

@router.get("/{patient_id}", response_model=Patient)
def get_patient(patient_id: str):
    for patient in patients:
        if patient.id == patient_id:
            return patient
        
    raise HTTPException(status_code=404, detail="Patient not found")
