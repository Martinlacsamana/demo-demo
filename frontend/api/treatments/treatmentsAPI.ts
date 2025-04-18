import type { TreatmentPlan } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches a treatment plan for a specific patient from the backend API
 */
export async function getTreatmentPlan(patientId: string): Promise<TreatmentPlan | null> {
  try {
    const response = await fetch(`${API_BASE}/treatments/${patientId}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Failed to fetch treatment plan for patient ${patientId}:`, error)
    throw new Error(`Failed to fetch treatment plan from API`)
  }
}

/**
 * Fetches all treatment plans from the backend API
 */
export async function getAllTreatmentPlans(): Promise<TreatmentPlan[]> {
  try {
    const response = await fetch(`${API_BASE}/treatments`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch treatment plans:", error)
    throw new Error("Failed to fetch treatment plans from API")
  }
}

/**
 * Creates a new treatment plan via the backend API
 */
export async function createTreatmentPlan(
  patientId: string,
  treatmentData: Omit<TreatmentPlan, "id" | "createdAt" | "updatedAt">,
): Promise<TreatmentPlan> {
  try {
    const response = await fetch(`${API_BASE}/treatments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        ...treatmentData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to create treatment plan:", error)
    throw new Error("Failed to create treatment plan via API")
  }
}