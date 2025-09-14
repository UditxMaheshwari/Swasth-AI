import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-gradient-to-r from-background to-background/50 medical-pattern">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:py-16">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <span className="text-primary text-lg">🩺</span>
            </div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SwasthAI</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">Revolutionizing Heathcare with Easy and Accessible explanation.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/health-check" className="text-muted-foreground transition-colors hover:text-primary">
                  SwasthAI
                </Link>
              </li>
              <li>
                <Link href="/find-doctor" className="text-muted-foreground transition-colors hover:text-primary">
                  SwasthDoc
                </Link>
              </li>
             
            
              <li>
                <Link href="/health-insights" className="text-muted-foreground transition-colors hover:text-primary">
                  SwasthBank
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/our-team" className="text-muted-foreground transition-colors hover:text-primary">
                  SwasthParivar
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/UditxMaheshwari"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/udit-maheshwari-524b9b303/"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SwasthAI
        </p>
      </div>
    </footer>
  )
}

