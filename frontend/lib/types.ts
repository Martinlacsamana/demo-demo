export interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  riskLevel: "Low" | "Medium" | "High"
  status: "Stable" | "High-Risk" | "Awaiting Upload" | "New Patient"
  lastUpdate: string
  avatar: string
}

// Treatment plan data types
export interface TreatmentPlan {
  id: string
  patientId: string
  recommendation: string
  rationale: string
  confidence: number
  dataPoints: number
  createdAt: string
  updatedAt: string
}