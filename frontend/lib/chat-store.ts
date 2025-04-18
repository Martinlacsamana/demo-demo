import { create } from "zustand"

type BriefingData = {
  highRiskCount: number
  pendingUploadsCount: number
  newRecommendationsCount: number
  patientsWithRecommendations: Array<{
    id: string
    name: string
    diagnosis: string
    urgency: string
    recommendationDate: string
  }>
}

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

type ChatStore = {
  isOpen: boolean
  messages: Message[]
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  updateLastAiMessage: (content: string) => void
  addBriefingMessage: (data: BriefingData) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [
    {
      id: "welcome",
      content: "Hello, I'm your Ataraxis AI oncology assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ],
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `${message.sender}-${Date.now()}`,
          timestamp: new Date(),
          ...message,
        },
      ],
    })),
  updateLastAiMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].sender === "ai") {
          messages[i] = { ...messages[i], content }
          break
        }
      }
      return { messages }
    }),
  addBriefingMessage: (data) => {
    const highRiskPatients = data.patientsWithRecommendations
      .filter((p) => p.urgency === "High")
      .map((p) => p.name)
      .join(", ")

    const briefingContent = `
Here's your daily briefing, Dr. Smith:

${data.newRecommendationsCount > 0 ? `• You have ${data.newRecommendationsCount} new AI recommendations awaiting review.` : ""}
${data.highRiskCount > 0 ? `• There are ${data.highRiskCount} high-risk cases that need attention.` : ""}
${data.pendingUploadsCount > 0 ? `• ${data.pendingUploadsCount} patients are awaiting slide uploads.` : ""}
${highRiskPatients ? `• Urgent attention needed for: ${highRiskPatients}` : ""}

Would you like me to prioritize these cases for you or provide more details on any specific patient?
    `.trim()

    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `ai-briefing-${Date.now()}`,
          content: "",
          sender: "ai",
          timestamp: new Date(),
        },
      ],
    }))

    // Simulate typing for the briefing message
    const characters = briefingContent.split("")
    let currentIndex = 0

    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        set((state) => {
          const messages = [...state.messages]
          const lastMessage = messages[messages.length - 1]
          if (lastMessage.sender === "ai") {
            messages[messages.length - 1] = {
              ...lastMessage,
              content: briefingContent.substring(0, currentIndex + 1),
            }
          }
          return { messages }
        })

        currentIndex++

        // Calculate next delay with some randomness for natural feel
        const nextDelay = 1
        const currentChar = characters[currentIndex - 1]
        setTimeout(typeNextCharacter, nextDelay)
      }
    }

    // Start typing
    setTimeout(typeNextCharacter, 400) // Initial delay before typing starts
  },
}))
