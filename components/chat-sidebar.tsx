//chat-sidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Check, Menu } from "lucide-react"
import type { Chat } from "@/lib/types"
import { Badge } from "@/components/custom/badge"
import { Button } from "@/components/custom/button"
import { Input } from "@/components/custom/input"
import { Avatar } from "@/components/custom/avatar"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isFiltered: boolean
  setIsFiltered: (isFiltered: boolean) => void
}

export default function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  searchQuery,
  setSearchQuery,
  isFiltered,
  setIsFiltered,
}: ChatSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [customFilter, setCustomFilter] = useState("Custom filter")

  // Check if screen size is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Auto-close sidebar on mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false)
      } else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true)
      }
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [isSidebarOpen])

  return (
    <div className={cn(
      "border-r flex flex-col h-full bg-white transition-all duration-300 ease-in-out",
      isSidebarOpen ? "w-[350px] min-w-[350px]" : isMobile ? "w-0 min-w-0 border-r-0" : "w-16 min-w-16"
    )}>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="bg-green-600 text-white" fallback="P" size="sm" />
          {isSidebarOpen && <span className="font-medium">Chats</span>}
        </div>
        {isSidebarOpen && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {isSidebarOpen && (
        <>
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-green-600 border-green-600"
                  onClick={() => setIsFiltered(!isFiltered)}
                >
                  {customFilter}
                  <Check className={cn("ml-2 h-4 w-4", !isFiltered && "opacity-0")} />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                Save
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className={cn("absolute right-1 top-1.5 h-6 w-6", !isFiltered && "opacity-0")}
              >
                <Filter className="h-4 w-4 text-green-600" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={cn("p-3 border-b hover:bg-gray-50 cursor-pointer", activeChat?.id === chat.id && "bg-gray-50")}
                onClick={() => {
                  onSelectChat(chat);
                  if (isMobile) setIsSidebarOpen(false);
                }}
              >
                <div className="flex gap-3">
                  <Avatar src={chat.avatar} fallback={chat.name.charAt(0)} alt={chat.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate">{chat.name}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {chat.lastMessage?.timestamp instanceof Date
                          ? new Intl.DateTimeFormat("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "2-digit",
                            }).format(chat.lastMessage.timestamp)
                          : chat.lastMessageDate}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-500 truncate">{chat.lastMessage?.content || chat.preview}</div>
                      <div className="flex gap-1">
                        {chat.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={tag === "Internal" ? "default" : "outline"}
                            className={cn(
                              "text-xs px-1.5 py-0 h-5",
                              tag === "Internal" && "bg-green-600",
                              tag === "Demo" && "text-orange-600 border-orange-600",
                              tag === "Signup" && "text-green-600 border-green-600",
                              tag === "Content" && "text-blue-600 border-blue-600",
                            )}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {chat.phone && <div className="text-xs text-gray-500 mt-1">{chat.phone}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}