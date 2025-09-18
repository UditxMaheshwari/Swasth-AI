"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Github, Linkedin, Mail, User, UserCircle } from "lucide-react"

const teamMembers = [
  {
    name: "Udit Maheshwari",
    role: "Frontend Designer & Backend Developer",
    bio: "Udit is a skilled MERNStack develoepr.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "Shahzad Khan",
    role: "Database & Cloud Specialist",
    bio: "Shahzad is an Databse and cloud specialist with a strong background in cloud computing and scalable AI solutions.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "Ishan Khan",
    role: "Three.JS expert",
    bio: "Ishan is an expert in three js models enhancing 3d model structure .",
    links: {
      github: "",
      linkedin: "",
      email:"",
      },
    },
    {
    name: "Suraj Kumar Ojha",
    role: "ThreeJS Specialist",
    bio: "Suraj is an expert in three js models enhancing 3d model structure .",
    links: {
      github: "",
      linkedin: "",
      email:"",
      },
  },
  {
    name: "Ritu Singh",
    role: "ML Specialist",
    bio: "Ritu Singh is a creative ML designer who focuses on crafting intuitive and engaging models along with it's profieciency'. She ensures that AI-powered applications have extreme precision.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "Muskan Bhadani",
    role: " ML Specialist",
    bio: "Muskan Bhadani is a creative ML designer who builds accurate, user-focused models to make AI applications practical and impactful",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
    },
    
]

const TeamMember = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-gray-900 dark:bg-black border border-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        {index < 4 ? (
          <User className="w-24 h-24 sm:w-32 sm:h-32 text-blue-400" />
        ) : (
          <UserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400" />
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">{member.name}</h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">{member.role}</p>
        <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4 line-clamp-4">{member.bio}</p>
        <div className="flex space-x-3 sm:space-x-4">
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </a>
          <a
            href={member.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </a>
          <a href={`mailto:${member.links.email}`} className="text-gray-400 hover:text-white">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function OurTeam() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black dark:bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Our Team
        </motion.h1>
        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 bg-black">
          {isLoaded &&
            teamMembers.map((member, index) => <TeamMember key={member.name} member={member} index={index} />)}
        </section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4 pt-10">Our Vision</h2>
          <p className="text-gray-400">
            At SwasthAI, we aim to make everyone aware of diseases by explaining them through interactive 3D models and providing real-time alerts.
            Our goal is to simplify complex medical information, making it easy to understand for everyone, and empower individuals to take timely action for their health.
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}
