import type { Patient } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches all patients from the backend API
 */
export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_BASE}/patients`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    throw new Error("Failed to fetch patients from API")
  }
}

/**
 * Fetches a single patient by ID from the backend API
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_BASE}/patients/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Failed to fetch patient with ID ${id}:`, error)
    throw new Error(`Failed to fetch patient with ID ${id} from API`)
  }
}
