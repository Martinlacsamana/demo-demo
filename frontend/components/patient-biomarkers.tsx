import { Card } from "@/components/ui/card"

// Mock biomarker data - in a real app, this would come from an API
const biomarkerData = {
  "1": { er: "Positive (90%)", pr: "Positive (85%)", her2: "Negative" },
  "2": { er: "Negative", pr: "Negative", her2: "Positive (3+)" },
  "3": { er: "Positive (65%)", pr: "Positive (40%)", her2: "Negative" },
  "4": { er: "N/A", pr: "N/A", her2: "N/A" },
  "5": { er: "N/A", pr: "N/A", her2: "N/A" },
  "6": { er: "Pending", pr: "Pending", her2: "Pending" },
}

type BiomarkerStatus = {
  er: string
  pr: string
  her2: string
}

export function PatientBiomarkers({ patientId }: { patientId: string }) {
  // Get biomarker data for this patient
  const biomarkers = biomarkerData[patientId as keyof typeof biomarkerData] || { er: "N/A", pr: "N/A", her2: "N/A" }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BiomarkerCard title="ER Status" value={biomarkers.er} />
      <BiomarkerCard title="PR Status" value={biomarkers.pr} />
      <BiomarkerCard title="HER2 Status" value={biomarkers.her2} />
    </div>
  )
}

function BiomarkerCard({ title, value }: { title: string; value: string }) {
  const getValueColor = (value: string) => {
    if (value.toLowerCase().includes("positive")) return "text-green-600"
    if (value.toLowerCase().includes("negative")) return "text-red-600"
    if (value.toLowerCase().includes("pending")) return "text-amber-600"
    return "text-gray-600"
  }

  return (
    <Card className="p-3 bg-gray-50 border border-gray-200">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`font-medium ${getValueColor(value)}`}>{value}</div>
    </Card>
  )
}
