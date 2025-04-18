"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PatientBiomarkers } from "@/components/patient-biomarkers"
import { UploadPanel } from "@/components/upload-panel"
import { getPatientById } from "@/api/patients/patientsAPI"
import { getTreatmentPlan } from "@/api/treatments/treatmentsAPI"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Patient } from "@/lib/types"
import type { TreatmentPlan } from "@/api/treatments/treatmentsAPI"

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch patient and treatment plan in parallel
        const [patientData, treatmentData] = await Promise.all([getPatientById(patientId), getTreatmentPlan(patientId)])

        setPatient(patientData)
        setTreatmentPlan(treatmentData)

        if (!patientData) {
          setError("Patient not found")
        } else {
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError("Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [patientId])

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error || !patient) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[80vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
        <p className="text-gray-600 mb-6">{error || "The patient you are looking for does not exist."}</p>
        <Button onClick={() => router.push("/patients")} className="bg-primary-blue">
          Return to Patients
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/patients")}
          className="flex items-center text-primary-blue hover:text-primary-blue/80"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Patients
        </Button>
      </div>

      <div className="flex flex-col space-y-6 w-full">
        {/* Patient Snapshot */}
        <Card className="border border-gray-200 shadow-sm w-full">
          <CardHeader className="bg-white pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-primary-blue">{patient.name}</h1>
                <p className="text-gray-600">{patient.diagnosis}</p>
              </div>
              <StatusBadge status={patient.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{patient.lastUpdate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Risk Level</p>
                <p className={`font-medium ${getRiskColor(patient.riskLevel)}`}>{patient.riskLevel}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Biomarker Status</h3>
              <PatientBiomarkers patientId={patient.id} />
            </div>
          </CardContent>
        </Card>

        {/* Suggested Treatment Plan */}
        <Card className="border border-gray-200 shadow-sm w-full">
          <CardHeader className="bg-white pb-2">
            <h2 className="text-xl font-semibold text-primary-blue">Suggested Treatment Plan</h2>
          </CardHeader>
          <CardContent className="pt-4">
            {treatmentPlan ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-700">Recommendation</h3>
                  <p className="mt-2 text-gray-900">{treatmentPlan.recommendation}</p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700">Rationale</h3>
                  <p className="mt-2 text-gray-900">{treatmentPlan.rationale}</p>
                </div>

                <div className="bg-primary-light-yellow p-4 rounded-md border border-primary-yellow/30">
                  <h3 className="text-md font-medium text-primary-blue">AI Confidence</h3>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="h-2 rounded-full bg-primary-yellow"
                        style={{ width: `${treatmentPlan.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{treatmentPlan.confidence}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on analysis of {treatmentPlan.dataPoints} similar cases and patient biomarkers
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Request Second Opinion
                  </Button>
                  <Button className="bg-primary-blue hover:bg-primary-blue/90">Accept Treatment Plan</Button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <UploadPanel patientId={patient.id} simplified={true} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "High-Risk":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>
    case "Awaiting Upload":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>
    case "Stable":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
    case "New Patient":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case "High":
      return "text-red-600"
    case "Medium":
      return "text-amber-600"
    case "Low":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}

function PatientDetailSkeleton() {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        {/* Patient Snapshot Skeleton */}
        <Card className="border border-gray-200 shadow-sm w-full">
          <CardHeader className="bg-white pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Plan Skeleton */}
        <Card className="border border-gray-200 shadow-sm w-full">
          <CardHeader className="bg-white pb-2">
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>

              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>

              <Skeleton className="h-32 w-full rounded-md" />

              <div className="mt-4 flex justify-end">
                <Skeleton className="h-9 w-40 mr-2" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
