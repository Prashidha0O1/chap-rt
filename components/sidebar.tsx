import { Home, MessageSquare, BarChart2, Users, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SidebarNav() {
  const navItems = [
    { icon: Home, active: false },
    { icon: MessageSquare, active: true },
    { icon: BarChart2, active: false },
    { icon: Users, active: false },
    { icon: Bell, active: false },
    { icon: Settings, active: false },
  ]

  return (
    <div className="border-t py-2 mt-auto">
      <div className="flex flex-col items-center gap-4">
        {navItems.map((item, index) => (
          <button key={index} className={cn("p-2 rounded-md hover:bg-gray-100", item.active && "text-green-600")}>
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  )
}

