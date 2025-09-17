"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Stethoscope, User, LogIn, UserPlus, LogOut } from "lucide-react" // Icons for dropdown
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

const translations = [
  { lang: "English", text: "SwasthAI" },
  { lang: "हिन्दी", text: "स्वस्थAI" },
  { lang: "ગુજરાતી", text: "સ્વસ્થAI" },
  { lang: "বাংলা", text: "স্বস্থAI" },
  { lang: "मराठी", text: "स्वस्थAI" },
  { lang: "தமிழ்", text: "ஸ்வஸ்த்AI" },
]

const greetings = [
  { lang: "English", text: "Hello" },
  { lang: "हिन्दी", text: "नमस्ते" },
  { lang: "ગુજરાતી", text: "નમસ્તે" },
  { lang: "বাংলা", text: "নমস্কার" },
  { lang: "मराठी", text: "नमस्कार" },
  { lang: "தமிழ்", text: "வணக்கம்" },
]

export default function Navbar() {
  const [indexLeft, setIndexLeft] = useState(0)
  const [indexRight, setIndexRight] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false) // Controls dropdown expansion
  const [showAuthOptions, setShowAuthOptions] = useState(false) // For login/signup dropdown
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const intervalLeft = setInterval(() => {
      setIndexLeft((prevIndex) => (prevIndex + 1) % translations.length)
    }, 3000)

    const intervalRight = setInterval(() => {
      setIndexRight((prevIndex) => (prevIndex + 1) % greetings.length)
    }, 3000)

    return () => {
      clearInterval(intervalLeft)
      clearInterval(intervalRight)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur-lg medical-glow">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Animated SwasthAI with Health Icon */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <Link href="/hero" className="flex items-center">
            <span className="text-xl font-bold italic transition-all duration-1000 sm:text-2xl lg:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {translations[indexLeft].text}
            </span>
          </Link>
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden sm:flex flex-1 items-center justify-center space-x-4 sm:space-x-6 text-sm font-medium">
          <Link href="/health-check" className="transition-colors hover:text-primary">
            SwasthAI
          </Link>
          <Link href="/find-doctor" className="transition-colors hover:text-primary">
            SwasthDoc
          </Link>
          
  
          <Link href="/health-insights" className="transition-colors hover:text-primary">
            SwasthBank
          </Link>
          <Link href="/our-team" className="transition-colors hover:text-primary">
            SwasthParivar
          </Link>
        </nav>

        {/* Mobile Dropdown (Single Visible Option) */}
        <div className="relative sm:hidden flex flex-1 justify-center">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-base md:text-lg font-medium flex items-center space-x-2 border rounded-lg px-3 py-1.5 md:px-4 md:py-2 bg-dark text-white"
            aria-expanded={dropdownOpen}
            aria-controls="mobile-menu"
          >
            <span>Menu</span>
            {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {dropdownOpen && (
            <div
              id="mobile-menu"
              className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[90%] bg-gray-900 shadow-lg rounded-lg text-center py-3 border border-gray-700 z-50"
            >
              <Link
                href="/health-check"
                className="block py-2 text-base font-medium hover:text-primary transition"
                onClick={() => setDropdownOpen(false)}
              >
                SwasthAI
              </Link>
              <Link
                href="/find-doctor"
                className="block py-2 text-base font-medium hover:text-primary transition"
                onClick={() => setDropdownOpen(false)}
              >
                SwasthDoc
              </Link>
             
              <Link
                href="/health-insights"
                className="block py-2 text-base font-medium hover:text-primary transition"
                onClick={() => setDropdownOpen(false)}
              >
                SwasthBank
              </Link>
              <Link
                href="/our-team"
                className="block py-2 text-base font-medium hover:text-primary transition"
                onClick={() => setDropdownOpen(false)}
              >
                SwasthParivar
              </Link>
              {!user && (
                <>
                  <button
                    className="block w-full py-2 text-base font-medium hover:text-primary transition"
                    onClick={() => {
                      router.push("/auth/login");
                      setDropdownOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="block w-full py-2 text-base font-medium hover:text-primary transition"
                    onClick={() => {
                      router.push("/auth/signup");
                      setDropdownOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
              {user && (
                <>
                  <button
                    className="block w-full py-2 text-base font-medium hover:text-primary transition"
                    onClick={() => {
                      router.push("/profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full py-2 text-base font-medium hover:text-primary transition"
                    onClick={async () => {
                      await signOut();
                      setDropdownOpen(false);
                      router.push("/auth/login");
                    }}
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Animated Hello with Login/Profile */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold italic transition-all duration-1000 sm:text-xl lg:text-2xl">
            {greetings[indexRight].text}
          </span>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/user-avatar.svg" alt="User" />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex w-full items-center">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/family-vault" className="flex w-full items-center">Family Vault</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/health-insights" className="flex w-full items-center">Health Records</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button 
                    onClick={async () => {
                      await signOut();
                      router.push("/auth/login");
                    }}
                    className="flex w-full items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => router.push("/auth/signup")}
                className="flex items-center gap-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

