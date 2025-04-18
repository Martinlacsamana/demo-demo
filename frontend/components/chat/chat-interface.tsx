"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/chat-store"

// Pre-determined responses
const PREDETERMINED_RESPONSES: Record<string, string> = {
  hello: "Hello! I'm your Ataraxis AI oncology assistant. How can I help you today?",
  hi: "Hello! I'm your Ataraxis AI oncology assistant. How can I help you today?",
  help: "I can help with patient risk assessment, treatment recommendations, and interpreting pathology results. What would you like to know?",
  treatment:
    "Treatment recommendations are based on multiple factors including cancer type, stage, biomarkers, and patient history. Would you like me to explain a specific treatment approach?",
  risk: "Risk assessment is calculated using our proprietary algorithm that considers histological features, biomarkers, and clinical data. The C-index indicates the model's predictive accuracy.",
  biomarkers:
    "I analyze key biomarkers including ER, PR, HER2 status, Ki-67 proliferation index, tumor infiltrating lymphocytes (TILs), and genetic markers when available.",
  model:
    "Our AI model is trained on over 50,000 pathology slides with known outcomes. It uses a deep learning approach combined with a Cox proportional hazards model for survival analysis.",
  accuracy:
    "The model's accuracy varies by cancer type, but generally achieves a C-index between 0.70-0.85, which is comparable to or better than traditional prognostic tools.",
  override:
    "You can override AI recommendations when clinical judgment suggests a different approach. All overrides are logged for quality improvement and auditing purposes.",
  thank: "You're welcome! I'm here to assist you anytime.",
  thanks: "You're welcome! I'm here to assist you anytime.",
  bye: "Goodbye! Feel free to reach out if you have more questions later.",
}

// Default responses when no keyword match is found
const DEFAULT_RESPONSES = [
  "I understand this is important. Could you provide more details so I can better assist you?",
  "I'm not sure I fully understand. Could you rephrase your question?",
  "That's an interesting question. Let me help you find the most relevant information.",
  "I'd be happy to help with that. Could you specify which patient or case you're referring to?",
]

export function ChatInterface() {
  const { isOpen, messages, toggleChat, addMessage, updateLastAiMessage } = useChatStore()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages when new messages are added or when typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    addMessage({
      content: inputValue,
      sender: "user",
    })

    setInputValue("")

    // Generate AI response
    const aiResponse = generateResponse(inputValue)
    simulateTyping(aiResponse)
  }

  const simulateTyping = (fullResponse: string) => {
    // Add an empty AI message first
    addMessage({
      content: "",
      sender: "ai",
    })

    setIsTyping(true)

    // Split the response into characters
    const characters = fullResponse.split("")
    let currentIndex = 0

    // Determine typing speed (characters per interval)
    const baseDelay = 30 // milliseconds
    const variableDelay = 20 // additional random milliseconds

    // Function to type the next character
    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        // Add the next character
        updateLastAiMessage(fullResponse.substring(0, currentIndex + 1))
        currentIndex++

        // Calculate next delay with some randomness for natural feel
        const nextDelay = baseDelay + Math.random() * variableDelay

        // Add slight pauses at punctuation
        const currentChar = characters[currentIndex - 1]
        if ([".", "!", "?", ",", ":"].includes(currentChar)) {
          setTimeout(typeNextCharacter, nextDelay * 5)
        } else {
          setTimeout(typeNextCharacter, nextDelay)
        }
      } else {
        // Finished typing
        setIsTyping(false)
      }
    }

    // Start typing
    setTimeout(typeNextCharacter, 500) // Initial delay before typing starts
  }

  const generateResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase()

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(PREDETERMINED_RESPONSES)) {
      if (lowercaseInput.includes(keyword)) {
        return response
      }
    }

    // Return a random default response if no keyword match
    return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Bubble */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-14 h-14 z-50 flex items-center justify-center transition-all duration-200",
          isOpen
            ? "bg-primary-yellow hover:bg-primary-yellow/90 shadow-lg shadow-primary-yellow/30 scale-110"
            : "bg-primary-blue hover:bg-primary-blue/90 shadow-lg",
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border-2 border-primary-blue/20 max-h-[70vh] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary-blue text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-primary-yellow">
                <AvatarImage src="/ataraxis-icon.png" alt="Ataraxis AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Ataraxis AI Assistant</h3>
                <p className="text-xs text-white/70">Oncology Specialist</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-primary-blue/50"
              onClick={toggleChat}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[40vh] bg-white/95">
            {messages.map((message, index) => (
              <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 shadow-sm",
                    message.sender === "user"
                      ? "bg-primary-blue text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none",
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.content && (
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-2 shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t-2 border-gray-200 flex items-center bg-white">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 mr-2 border-gray-300 focus-visible:ring-primary-blue"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-primary-blue hover:bg-primary-blue/90 h-9 w-9 p-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
