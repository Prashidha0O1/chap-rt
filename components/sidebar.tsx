"use client"

import { Home, MessageSquare, BarChart2, Users, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/custom/button"
import { useState, useEffect } from "react"

export default function SidebarNav() {
  const [isMobile, setIsMobile] = useState(false)
  
  const navItems = [
    { icon: Home, label: "Home", active: false },
    { icon: MessageSquare, label: "Messages", active: true },
    { icon: BarChart2, label: "Analytics", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: Bell, label: "Notifications", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  // Check if screen size is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is a common breakpoint for tablets
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full flex flex-col justify-center bg-white border-l z-10",
      isMobile ? "w-16" : "w-16"
    )}>
      <div className="flex flex-col items-center gap-6 py-4">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-md hover:bg-gray-100 transition-all group relative", 
              item.active && "text-green-600"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="absolute left-full ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap hidden group-hover:block">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}