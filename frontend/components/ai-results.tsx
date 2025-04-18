"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"

// Mock AI results data - in a real app, this would come from an API
const aiResultsData = {
  "1": {
    recurrenceRisk: "18%",
    confidenceScore: "C-index: 0.78",
    modelExplanation: "Low nuclear grade, high TILs, hormone receptor positive",
    treatmentPlan: "Recommend hormone therapy without chemotherapy",
  },
  "2": {
    recurrenceRisk: "42%",
    confidenceScore: "C-index: 0.71",
    modelExplanation: "High nuclear grade, low TILs, triple negative",
    treatmentPlan: "Recommend adjuvant chemotherapy",
  },
  "3": {
    recurrenceRisk: "12%",
    confidenceScore: "C-index: 0.82",
    modelExplanation: "Low nuclear grade, hormone receptor positive",
    treatmentPlan: "Recommend hormone therapy only",
  },
  "4": {
    recurrenceRisk: "35%",
    confidenceScore: "C-index: 0.75",
    modelExplanation: "Intermediate nuclear grade, moderate TILs",
    treatmentPlan: "Consider adjuvant chemotherapy",
  },
  "5": {
    recurrenceRisk: "8%",
    confidenceScore: "C-index: 0.85",
    modelExplanation: "Low nuclear grade, high TILs",
    treatmentPlan: "Recommend active surveillance",
  },
  "6": {
    recurrenceRisk: "27%",
    confidenceScore: "C-index: 0.73",
    modelExplanation: "Intermediate nuclear grade, moderate TILs",
    treatmentPlan: "Consider adjuvant therapy",
  },
}

type AIResultsProps = {
  patientId: string
}

export function AIResults({ patientId }: AIResultsProps) {
  const [decision, setDecision] = useState<"accepted" | "overridden" | null>(null)
  const [overrideReason, setOverrideReason] = useState("")
  const [showOverrideInput, setShowOverrideInput] = useState(false)
  const [timestamp, setTimestamp] = useState<Date | null>(null)
  const [showDetails, setShowDetails] = useState(true)

  // Get AI results for this patient
  const results = aiResultsData[patientId as keyof typeof aiResultsData] || {
    recurrenceRisk: "N/A",
    confidenceScore: "N/A",
    modelExplanation: "Insufficient data for analysis",
    treatmentPlan: "Consult with specialist",
  }

  const handleAccept = () => {
    setDecision("accepted")
    setTimestamp(new Date())
  }

  const handleOverride = () => {
    if (showOverrideInput) {
      if (overrideReason.trim() === "") {
        alert("Please provide a reason for overriding the recommendation")
        return
      }
      setDecision("overridden")
      setTimestamp(new Date())
    } else {
      setShowOverrideInput(true)
    }
  }

  const getRiskColor = (risk: string) => {
    const riskValue = Number.parseInt(risk.replace("%", ""))
    if (riskValue < 15) return "text-green-600"
    if (riskValue < 30) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <Card className="border border-gray-200 shadow-sm w-full mt-6">
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-primary-blue">AI Analysis Results</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="h-8 w-8 p-0">
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Recurrence Risk</h3>
                <p className={`text-2xl font-bold ${getRiskColor(results.recurrenceRisk)}`}>{results.recurrenceRisk}</p>
                <p className="text-sm text-gray-500">{results.confidenceScore}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Model Explanation</h3>
                <p className="text-gray-900">{results.modelExplanation}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">AI-Suggested Treatment</h3>
                <p className="text-gray-900 font-medium">{results.treatmentPlan}</p>
              </div>

              {!decision ? (
                <div className="space-y-3">
                  {showOverrideInput && (
                    <div className="space-y-2">
                      <label htmlFor="override-reason" className="text-sm font-medium text-gray-500">
                        Reason for Override
                      </label>
                      <Textarea
                        id="override-reason"
                        placeholder="Please provide your clinical reasoning for overriding the AI recommendation..."
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={handleAccept}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Recommendation
                    </Button>
                    <Button
                      className={`${
                        showOverrideInput ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-600 hover:bg-gray-700"
                      } text-white flex-1`}
                      onClick={handleOverride}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {showOverrideInput ? "Confirm Override" : "Override"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    {decision === "accepted" ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    )}
                    <span className="font-medium">
                      {decision === "accepted" ? "Recommendation Accepted" : "Recommendation Overridden"}
                    </span>
                  </div>
                  {decision === "overridden" && <p className="mt-2 text-gray-700 text-sm">{overrideReason}</p>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}

      {decision && timestamp && (
        <CardFooter className="bg-gray-50 text-xs text-gray-500 flex items-center border-t">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {decision === "accepted" ? "Recommendation accepted" : "Recommendation overridden"} on{" "}
            {format(timestamp, "MMM d, yyyy 'at' h:mm a")}
          </span>
        </CardFooter>
      )}
    </Card>
  )
}
