import type { Patient } from "@/lib/types"

// Mock patient data - in a real app, this would come from an external API
const patients: Patient[] = [
  {
    id: "1",
    name: "Jane Smith",
    age: 62,
    diagnosis: "Breast Cancer Stage II",
    riskLevel: "Medium",
    status: "Stable",
    lastUpdate: "2 days ago",
    avatar: "/contemplative-artist.png",
  },
  {
    id: "2",
    name: "Robert Johnson",
    age: 71,
    diagnosis: "Lung Cancer Stage III",
    riskLevel: "High",
    status: "High-Risk",
    lastUpdate: "Today",
    avatar: "/contemplative-elder.png",
  },
  {
    id: "3",
    name: "Maria Garcia",
    age: 54,
    diagnosis: "Colorectal Cancer Stage I",
    riskLevel: "Low",
    status: "Stable",
    lastUpdate: "1 week ago",
    avatar: "/contemplative-artist.png",
  },
  {
    id: "4",
    name: "David Lee",
    age: 67,
    diagnosis: "Prostate Cancer",
    riskLevel: "Medium",
    status: "Awaiting Upload",
    lastUpdate: "3 days ago",
    avatar: "/thoughtful-urbanite.png",
  },
  {
    id: "5",
    name: "Sarah Williams",
    age: 45,
    diagnosis: "Thyroid Cancer",
    riskLevel: "Low",
    status: "Stable",
    lastUpdate: "5 days ago",
    avatar: "/contemplative-artist.png",
  },
  {
    id: "6",
    name: "Michael Brown",
    age: 59,
    diagnosis: "Melanoma Stage II",
    riskLevel: "Medium",
    status: "New Patient",
    lastUpdate: "Just now",
    avatar: "/thoughtful-urbanite.png",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Simulates fetching all patients from an external API
 * In a real app, this would be a fetch call to an actual backend endpoint
 */
export async function getPatients(): Promise<Patient[]> {
  try {
    // Simulate API call delay
    await delay(800)

    // Simulate successful API response
    return [...patients]
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    throw new Error("Failed to fetch patients from API")
  }
}

/**
 * Simulates fetching a single patient by ID from an external API
 * In a real app, this would be a fetch call to an actual backend endpoint
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    // Simulate API call delay
    await delay(600)

    // Simulate successful API response
    const patient = patients.find((p) => p.id === id)

    if (!patient) {
      // Simulate 404 not found
      throw new Error("Patient not found")
    }

    return patient
  } catch (error) {
    console.error(`Failed to fetch patient with ID ${id}:`, error)

    // Re-throw the error to be handled by the component
    if ((error as Error).message === "Patient not found") {
      return null
    }

    throw new Error(`Failed to fetch patient with ID ${id} from API`)
  }
}
