"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MedicalChatbot from "@/components/medical-chatbot"

const translations = [
  { lang: "English", text: "AI-Powered Healthcare Support" },
  { lang: "हिन्दी", text: "एआई-पावर्ड स्वास्थ्य समर्थन" },
  { lang: "ગુજરાતી", text: "એઆઈ-સંપન્ન આરોગ્ય સહાય" },
  { lang: "বাংলা", text: "এআই-চালিত স্বাস্থ্য সহায়তা" },
  { lang: "मराठी", text: "एआय-सक्षम आरोग्य मदत" },
  { lang: "தமிழ்", text: "ஏஐ இயக்கப்படும் ஆரோக்கிய ஆதரவு" },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container relative max-w-screen-2xl mx-auto py-20 px-4 sm:py-28 md:py-36 medical-bg dark:medical-bg-dark medical-pattern">
      {/* Medical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 space-y-12">
        {/* Animated Heading */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            key={index}
            className="bg-gradient-to-br from-primary via-primary/90 to-accent bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight transition-all duration-1000"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            {translations[index].text}
          </motion.h1>
          <motion.p 
            className="mx-auto max-w-[48rem] leading-relaxed text-muted-foreground text-base sm:text-lg md:text-xl px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the future of healthcare with SwasthAI. Get instant medical guidance, upload symptoms through images, 
            or speak directly to our AI assistant. Your health journey starts with a simple conversation.
          </motion.p>
        </motion.div>

        {/* Medical Chatbot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center"
        >
          <MedicalChatbot />
        </motion.div>

        {/* Medical Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center"
        >
          {[
            { label: "3D Expanation", value: "24/7", icon: "🤖" },
            { label: "Languages Supported", value: "5+", icon: "🗣️" },
            { label: "Disease Knowledge", value: "10+", icon: "📋" }
          ].map((stat, index) => (
            <div key={stat.label} className="medical-card dark:medical-card-dark p-6 rounded-xl">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

