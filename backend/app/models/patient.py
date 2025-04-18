from pydantic import BaseModel

class Patient(BaseModel):
    id: str
    name: str
    age: int
    diagnosis: str
    riskLevel: str
    status: str
    lastUpdate: str
    avatar: str
