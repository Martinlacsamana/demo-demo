"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X, Check, Play, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AIResults } from "@/components/ai-results"
import { createTreatmentPlan } from "@/api/treatments/treatmentsAPI"

interface UploadPanelProps {
  patientId: string
  simplified?: boolean
}

export function UploadPanel({ patientId, simplified = false }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [aiTestRunning, setAiTestRunning] = useState(false)
  const [aiTestComplete, setAiTestComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setFile(file)
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)
        setUploadComplete(true)
      }
    }, 300)
  }

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadComplete(false)
    setAiTestRunning(false)
    setAiTestComplete(false)
  }

  const runAITest = async () => {
    setAiTestRunning(true)

    try {
      // Simulate creating a treatment plan via API
      // In a real app, this would send the image to the backend for analysis
      await createTreatmentPlan(patientId, {
        patientId,
        recommendation: "Adjuvant chemotherapy followed by radiation therapy",
        rationale:
          "Based on analysis of the uploaded pathology slide, the tumor shows high-grade features with evidence of lymphovascular invasion. Molecular profiling indicates high risk of recurrence.",
        confidence: 78,
        dataPoints: 850,
      })

      setAiTestComplete(true)

      // In a real app, we would refresh the page or update the state to show the new treatment plan
      if (simplified) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error("Error generating treatment plan:", error)
      alert("Failed to generate treatment plan. Please try again.")
    } finally {
      setAiTestRunning(false)
    }
  }

  const renderUploadContent = () => (
    <>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary-yellow bg-primary-light-yellow/50"
            : "border-gray-300 hover:border-primary-yellow"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileInput} />

        <div className="flex flex-col items-center justify-center space-y-3">
          {file ? (
            <>
              <div className="bg-primary-light-yellow p-3 rounded-full">
                <FileText className="h-8 w-8 text-primary-yellow" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  resetUpload()
                }}
                className="flex items-center"
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </>
          ) : (
            <>
              <div className="bg-primary-light-yellow p-3 rounded-full">
                <Upload className="h-8 w-8 text-primary-yellow" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Drag and drop or click to upload</p>
                <p className="text-sm text-gray-500">Upload a pathology slide image (PNG, JPG, TIFF)</p>
              </div>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          className="bg-primary-blue hover:bg-primary-blue/90"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload Slide"}
        </Button>
      </div>
    </>
  )

  const renderCompleteContent = () => (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-900">Upload Complete</p>
        <p className="text-sm text-gray-500 mt-1">Your pathology slide has been uploaded successfully.</p>
      </div>

      {!aiTestComplete && (
        <Button
          onClick={runAITest}
          className="mt-4 bg-primary-yellow hover:bg-primary-yellow/90 text-white"
          disabled={aiTestRunning}
        >
          {aiTestRunning ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Generate Treatment Plan
            </>
          )}
        </Button>
      )}

      {!simplified && (
        <div className="flex justify-between w-full mt-2">
          <Button variant="outline" onClick={resetUpload} size="sm" className="text-gray-600">
            Upload Another Slide
          </Button>
        </div>
      )}
    </div>
  )

  if (simplified) {
    return <div className="w-full">{!uploadComplete ? renderUploadContent() : renderCompleteContent()}</div>
  }

  return (
    <>
      <Card className="border border-gray-200 shadow-sm w-full">
        <CardHeader className="bg-white pb-2">
          <CardTitle className="text-xl font-semibold text-primary-blue">Pathology Slide Upload</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">{!uploadComplete ? renderUploadContent() : renderCompleteContent()}</CardContent>
      </Card>

      {aiTestComplete && !simplified && <AIResults patientId={patientId} />}
    </>
  )
}

export function NoTreatmentUploadPanel({ patientId }: { patientId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setFile(file)
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)

        try {
          // Simulate creating a treatment plan via API
          createTreatmentPlan(patientId, {
            patientId,
            recommendation: "Adjuvant chemotherapy followed by radiation therapy",
            rationale: "Based on analysis of the uploaded pathology slide, the tumor shows high-grade features with evidence of lymphovascular invasion. Molecular profiling indicates high risk of recurrence.",
            confidence: 78,
            dataPoints: 850,
          })

          // In a real app, we would refresh the page or update the state to show the new treatment plan
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } catch (error) {
          console.error("Error generating treatment plan:", error)
          alert("Failed to generate treatment plan. Please try again.")
          setUploading(false)
        }
      }
    }, 300)
  }

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="bg-gray-100 p-3 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">No treatment suggestion available yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Upload a pathology slide to generate an AI-powered treatment recommendation
      </p>

      <div className="w-full max-w-md">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary-yellow bg-primary-light-yellow/50"
              : "border-gray-300 hover:border-primary-yellow"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileInput} />

          <div className="flex flex-col items-center justify-center space-y-3">
            {file ? (
              <>
                <div className="bg-primary-light-yellow p-3 rounded-full">
                  <FileText className="h-8 w-8 text-primary-yellow" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-primary-light-yellow p-3 rounded-full">
                  <Upload className="h-8 w-8 text-primary-yellow" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Drag and drop or click to upload</p>
                  <p className="text-sm text-gray-500">Upload a pathology slide image (PNG, JPG, TIFF)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-primary-blue hover:bg-primary-blue/90"
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Upload Slide"}
          </Button>
        </div>
      </div>
    </div>
  )
}
