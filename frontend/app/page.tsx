"use client"

import type React from "react"
import { Users, AlertTriangle, Upload, Brain, ArrowRight, FileUp, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { patients } from "@/lib/data"
import Link from "next/link"
import { useChatStore } from "@/lib/chat-store"

// Mock data for patients with recommendations
const patientsWithRecommendations = [
  {
    id: "1",
    name: "Jane Smith",
    diagnosis: "Breast Cancer Stage II",
    urgency: "Medium",
    recommendationDate: "Today",
  },
  {
    id: "2",
    name: "Robert Johnson",
    diagnosis: "Lung Cancer Stage III",
    urgency: "High",
    recommendationDate: "Yesterday",
  },
  {
    id: "3",
    name: "Maria Garcia",
    diagnosis: "Colorectal Cancer Stage I",
    urgency: "Low",
    recommendationDate: "2 days ago",
  },
]

export default function Dashboard() {
  const { openChat, addBriefingMessage } = useChatStore()

  // Calculate metrics
  const highRiskCount = patients.filter((p) => p.riskLevel === "High").length
  const pendingUploadsCount = patients.filter((p) => p.status === "Awaiting Upload").length
  const newRecommendationsCount = patientsWithRecommendations.length
  const patientsReviewedCount = patients.length

  const handleBriefMe = () => {
    // Open chat and add briefing message
    openChat()
    addBriefingMessage({
      highRiskCount,
      pendingUploadsCount,
      newRecommendationsCount,
      patientsWithRecommendations,
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Assistant Overview Panel */}
      <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
        <div className="bg-primary-blue text-white p-5 border-b border-primary-blue/30">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold">Welcome back, Dr. Smith. Let's get you up to speed.</h1>
            <Button onClick={handleBriefMe} className="bg-primary-yellow hover:bg-primary-yellow/90 text-white w-fit">
              <Sparkles className="mr-1 h-4 w-4" />
              Brief Me
            </Button>
          </div>
        </div>

        <CardContent className="p-5">
          <h2 className="text-lg font-medium text-primary-blue mb-4">Assistant Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard
              title="Patients Reviewed"
              value={patientsReviewedCount}
              icon={Users}
              color="bg-blue-100 text-blue-600"
            />
            <OverviewCard
              title="New Recommendations"
              value={newRecommendationsCount}
              icon={Brain}
              color="bg-purple-100 text-purple-600"
            />
            <OverviewCard
              title="High-Risk Cases"
              value={highRiskCount}
              icon={AlertTriangle}
              color="bg-red-100 text-red-600"
            />
            <OverviewCard
              title="Pending Uploads"
              value={pendingUploadsCount}
              icon={Upload}
              color="bg-amber-100 text-amber-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients Awaiting Review */}
        <Card className="border border-gray-200 shadow-sm bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-primary-blue flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary-yellow" />
                Treatments Awaiting Review
              </div>
              <Link
                href="/patients"
                className="text-sm font-medium text-primary-blue hover:underline flex items-center"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {patientsWithRecommendations.map((patient) => (
                <PatientRecommendationItem key={patient.id} patient={patient} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-primary-blue">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button className="bg-primary-blue hover:bg-primary-blue/90 w-full justify-start" asChild>
                <Link href="/patients">
                  <Users className="mr-2 h-4 w-4" />
                  View Patients
                </Link>
              </Button>
              <Button className="bg-primary-yellow hover:bg-primary-yellow/90 w-full justify-start text-white">
                <Upload className="mr-2 h-4 w-4" />
                Upload Slide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Run Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Alerts
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Uploads</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">David Lee - Prostate Cancer</p>
                    <p className="text-xs text-gray-500">Uploaded 3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Michael Brown - Melanoma</p>
                    <p className="text-xs text-gray-500">Uploaded today</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper components
function OverviewCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function PatientRecommendationItem({ patient }: { patient: (typeof patientsWithRecommendations)[0] }) {
  const patientData = patients.find((p) => p.id === patient.id)
  const avatar = patientData?.avatar || "/placeholder.svg"

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-600 border-red-200"
      case "Medium":
        return "bg-amber-100 text-amber-600 border-amber-200"
      case "Low":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <Link href={`/patients/${patient.id}`}>
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback className="bg-primary-yellow text-white">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium text-gray-900">{patient.name}</p>
            <p className="text-sm text-gray-500">{patient.diagnosis}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Badge className={`mr-3 ${getUrgencyColor(patient.urgency)}`}>{patient.urgency}</Badge>
          <p className="text-xs text-gray-500">{patient.recommendationDate}</p>
        </div>
      </div>
    </Link>
  )
}
