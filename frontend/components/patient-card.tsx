"use client"

import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Patient } from "@/lib/types"

export function PatientCard({ patient }: { patient: Patient }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="bg-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback className="bg-primary-yellow text-white">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-primary-blue">{patient.name}</h3>
              <p className="text-sm text-gray-500">{patient.diagnosis}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} />
        </div>
      </div>
      <CardContent className="p-4 pt-0 mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Age: {patient.age}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last update: {patient.lastUpdate}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Level</span>
            <span className={`text-sm font-bold ${getRiskColor(patient.riskLevel)}`}>{patient.riskLevel}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${getRiskBgColor(patient.riskLevel)}`}
              style={{ width: getRiskWidth(patient.riskLevel) }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 flex justify-between mt-auto">
        <Button
          className="bg-primary-blue hover:bg-primary-blue/90"
          size="sm"
          onClick={() => router.push(`/patients/${patient.id}`)}
        >
          View Recommendation
        </Button>
        <Button variant="outline" size="sm">
          Visit Profile
        </Button>
      </CardFooter>
    </Card>
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

function getRiskBgColor(risk: string) {
  switch (risk) {
    case "High":
      return "bg-red-500"
    case "Medium":
      return "bg-amber-500"
    case "Low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

function getRiskWidth(risk: string) {
  switch (risk) {
    case "High":
      return "85%"
    case "Medium":
      return "50%"
    case "Low":
      return "25%"
    default:
      return "0%"
  }
}
