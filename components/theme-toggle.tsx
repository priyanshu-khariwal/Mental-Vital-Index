"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 bg-transparent">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 bg-transparent"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 text-yellow-500" />
          <span className="sr-only">Switch to light mode</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-slate-700" />
          <span className="sr-only">Switch to dark mode</span>
        </>
      )}
    </Button>
  )
}
