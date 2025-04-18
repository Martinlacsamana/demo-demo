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
