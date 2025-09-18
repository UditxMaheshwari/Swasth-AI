"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image, 
  Bot, 
  User, 
  Heart, 
  Activity,
  Stethoscope,
  Plus,
  X
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  mediaType?: 'text' | 'image' | 'voice'
  mediaUrl?: string
}

export default function MedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m SwasthAI, your AI-powered medical assistant powered by Google Gemini. I can help you with:\n\n• Symptom analysis and general health guidance\n• Understanding medical conditions\n• Medication information\n• Healthy lifestyle recommendations\n\n⚠️ **Important**: I provide general health information only. For serious concerns, emergencies, or specific medical advice, please consult a qualified healthcare professional.\n\nHow can I assist you today?',
      timestamp: new Date(),
      mediaType: 'text'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/gemini', {
          method: 'GET',
        })
        setApiStatus(response.ok ? 'online' : 'offline')
      } catch (error) {
        setApiStatus('offline')
      }
    }
    
    checkApiStatus()
  }, [])

  const handleSendMessage = async (content: string, mediaType: 'text' | 'image' | 'voice' = 'text', mediaUrl?: string) => {
    if (!content.trim() && mediaType === 'text') return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content || (mediaType === 'image' ? 'Image uploaded' : 'Voice message'),
      timestamp: new Date(),
      mediaType,
      mediaUrl
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Call Gemini API for medical assistance
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: content,
          type: 'symptoms',
          context: {
            mediaType,
            isHealthQuery: true,
            userContext: 'Medical chatbot consultation'
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setApiStatus('online')
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.response || 'I apologize, but I couldn\'t process your request. Please try again or consult a healthcare professional.',
          timestamp: new Date(),
          mediaType: 'text'
        }
        setMessages(prev => [...prev, botResponse])
      } else {
        setApiStatus('offline')
        // Fallback response if API fails
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'I\'m experiencing technical difficulties with the AI service. Please try again later or consult a healthcare professional for immediate concerns.',
          timestamp: new Date(),
          mediaType: 'text'
        }
        setMessages(prev => [...prev, errorResponse])
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      setApiStatus('offline')
      // Fallback to local response if API is unavailable
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `${getAIResponse(content, mediaType)}\n\n⚠️ Note: AI service is currently unavailable. This is a basic response. For accurate medical advice, please consult a healthcare professional.`,
        timestamp: new Date(),
        mediaType: 'text'
      }
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getAIResponse = (userInput: string, mediaType: string): string => {
    // Simulate different responses based on input type
    if (mediaType === 'image') {
      return "I can see the image you've shared. Based on what I observe, I'd recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, here are some general care tips..."
    }
    
    if (mediaType === 'voice') {
      return "I've processed your voice message. Thank you for sharing your concerns. Based on what you've described, here's what I recommend..."
    }

    // Simple text response simulation
    const responses = [
      "Thank you for sharing your symptoms. Based on what you've described, I recommend monitoring your condition and consulting with a healthcare provider if symptoms persist.",
      "I understand your concerns. Here are some general recommendations that might help, but please consult a medical professional for personalized advice.",
      "Your health question is important. While I can provide general guidance, it's best to seek professional medical advice for proper diagnosis and treatment.",
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputText)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        handleSendMessage('', 'image', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(blob)
        handleSendMessage('Voice message recorded', 'voice', audioUrl)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="swasth-chatbot dark:swasth-chatbot-dark border-2">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b swasth-gradient dark:swasth-gradient-dark flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full swasth-pulse">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground dark:text-foreground">SwasthAI Medical Assistant</h2>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground/90">Your AI-powered healthcare companion</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1">
                {apiStatus === 'online' && (
                  <>
                    <Activity className="h-4 w-4 text-green-500 pulse-animation" />
                    <span className="text-sm text-green-600 dark:text-green-400">Gemini AI Online</span>
                  </>
                )}
                {apiStatus === 'offline' && (
                  <>
                    <div className="h-4 w-4 rounded-full bg-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">AI Offline</span>
                  </>
                )}
                {apiStatus === 'checking' && (
                  <>
                    <div className="h-4 w-4 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Connecting...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 swasth-gradient dark:swasth-gradient-dark">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`p-2 rounded-full ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'swasth-message-user ml-auto'
                        : 'swasth-message-bot dark:swasth-message-bot-dark'
                    }`}>
                      {message.mediaType === 'image' && message.mediaUrl && (
                        <img 
                          src={message.mediaUrl} 
                          alt="Uploaded image" 
                          className="max-w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      {message.mediaType === 'voice' && message.mediaUrl && (
                        <audio controls className="mb-2">
                          <source src={message.mediaUrl} type="audio/wav" />
                        </audio>
                      )}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="p-2 rounded-full bg-primary/20 text-primary swasth-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="swasth-message-bot dark:swasth-message-bot-dark rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-foreground dark:text-foreground/90">SwasthAI is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t swasth-gradient dark:swasth-gradient-dark">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your health question here..."
                  className="pr-12 bg-background border-border text-foreground dark:text-foreground placeholder:text-muted-foreground/70 dark:placeholder:text-muted-foreground/70"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showOptions ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Options Menu */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2 mt-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Upload Image
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 ${isRecording ? 'bg-red-100 text-red-700' : ''}`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          "I have a headache and fever",
          "What are the symptoms of diabetes?", 
          "How to manage high blood pressure?",
          "Healthy diet recommendations",
          "Exercise tips for beginners",
          "When should I see a doctor?"
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage(suggestion)}
            className="text-xs hover:bg-accent/50"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}