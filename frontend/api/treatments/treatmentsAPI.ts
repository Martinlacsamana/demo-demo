// Treatment plan data types
export type TreatmentPlan = {
  id: string
  patientId: string
  recommendation: string
  rationale: string
  confidence: number
  dataPoints: number
  createdAt: string
  updatedAt: string
}

// Mock treatment plan data - in a real app, this would come from an external API
const treatmentPlans: TreatmentPlan[] = [
  {
    id: "t1",
    patientId: "1",
    recommendation: "Hormone therapy (Tamoxifen) for 5-10 years without adjuvant chemotherapy",
    rationale:
      "Patient has ER+/PR+ breast cancer with low Ki-67 proliferation index, negative lymph nodes, and low genomic recurrence score. Molecular profiling indicates low risk of recurrence with endocrine therapy alone.",
    confidence: 87,
    dataPoints: 1240,
    createdAt: "2025-04-10T14:32:00Z",
    updatedAt: "2025-04-10T14:32:00Z",
  },
  {
    id: "t2",
    patientId: "2",
    recommendation: "Combination chemotherapy (cisplatin/pemetrexed) followed by immunotherapy maintenance",
    rationale:
      "Patient has stage III non-small cell lung cancer with high PD-L1 expression. Genomic analysis shows no targetable mutations. Recent clinical trials demonstrate survival benefit with this approach.",
    confidence: 82,
    dataPoints: 950,
    createdAt: "2025-04-12T09:15:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
  },
  {
    id: "t3",
    patientId: "3",
    recommendation: "Surgical resection followed by adjuvant FOLFOX chemotherapy for 3 months",
    rationale:
      "Patient has stage I colorectal cancer with microsatellite stability and low-risk features. Short-course adjuvant therapy is recommended based on recent trials showing non-inferiority to 6-month regimens.",
    confidence: 91,
    dataPoints: 1580,
    createdAt: "2025-04-08T11:20:00Z",
    updatedAt: "2025-04-08T11:20:00Z",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Simulates fetching a treatment plan for a specific patient from an external API
 * In a real app, this would be a fetch call to an actual backend endpoint
 */
export async function getTreatmentPlan(patientId: string): Promise<TreatmentPlan | null> {
  try {
    // Simulate API call delay
    await delay(700)

    // Simulate successful API response
    const treatmentPlan = treatmentPlans.find((plan) => plan.patientId === patientId)

    // Return the treatment plan or null if not found
    return treatmentPlan || null
  } catch (error) {
    console.error(`Failed to fetch treatment plan for patient ${patientId}:`, error)
    throw new Error(`Failed to fetch treatment plan from API`)
  }
}

/**
 * Simulates fetching all treatment plans from an external API
 * In a real app, this would be a fetch call to an actual backend endpoint
 */
export async function getAllTreatmentPlans(): Promise<TreatmentPlan[]> {
  try {
    // Simulate API call delay
    await delay(900)

    // Simulate successful API response
    return [...treatmentPlans]
  } catch (error) {
    console.error("Failed to fetch treatment plans:", error)
    throw new Error("Failed to fetch treatment plans from API")
  }
}

/**
 * Simulates creating a new treatment plan via an external API
 * In a real app, this would be a POST request to an actual backend endpoint
 */
export async function createTreatmentPlan(
  patientId: string,
  treatmentData: Omit<TreatmentPlan, "id" | "createdAt" | "updatedAt">,
): Promise<TreatmentPlan> {
  try {
    // Simulate API call delay
    await delay(1200)

    // Generate a new treatment plan with an ID and timestamps
    const newTreatmentPlan: TreatmentPlan = {
      id: `t${treatmentPlans.length + 1}`,
      patientId,
      ...treatmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real API, this would be saved to a database
    // Here we're just simulating the response
    return newTreatmentPlan
  } catch (error) {
    console.error("Failed to create treatment plan:", error)
    throw new Error("Failed to create treatment plan via API")
  }
}
