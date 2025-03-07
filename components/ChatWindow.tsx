"use client"

import { useState, useEffect } from "react"
import ChatSidebar from "./chat-sidebar"
import ChatArea from "./chatarea"
import SidebarNav from "./sidebar"
import type { Chat, Message, User } from "@/lib/types"
import { initialChats, initialUsers } from "@/lib/data"
import { Menu } from "lucide-react"
import { Button } from "@/components/custom/button"

export default function ChatInterface() {
  const [activeChat, setActiveChat] = useState<Chat | null>(initialChats[0])
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [users] = useState<User[]>(initialUsers)
  const [filter, setFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltered, setIsFiltered] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen size is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Auto-hide sidebar on mobile
      if (mobile && isSidebarVisible) {
        setIsSidebarVisible(false)
      } else if (!mobile && !isSidebarVisible) {
        setIsSidebarVisible(true)
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
  }, [isSidebarVisible])

  const handleSendMessage = (content: string) => {
    if (!activeChat || !content.trim()) return

    const currentUser = users.find((user) => user.name === "Periskope")

    if (!currentUser) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: currentUser,
      timestamp: new Date(),
      status: "sent",
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: newMessage,
    }

    setChats((prevChats) => prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)))

    setActiveChat(updatedChat)
  }

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = searchQuery ? chat.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

    const matchesFilter = filter ? chat.tags.includes(filter) : true

    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex h-full w-full bg-background relative">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 left-3 z-50"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div className={`flex h-full transition-all duration-300 ease-in-out ${isMobile && !isSidebarVisible ? "w-0" : ""}`}>
        <ChatSidebar
          chats={filteredChats}
          activeChat={activeChat}
          onSelectChat={(chat) => {
            setActiveChat(chat);
            if (isMobile) setIsSidebarVisible(false);
          }}
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFiltered={isFiltered}
          setIsFiltered={setIsFiltered}
        />
      </div>
      <div className="flex-1 h-full mr-16">
        <ChatArea
          chat={activeChat}
          onSendMessage={handleSendMessage}
          currentUser={users.find((user) => user.name === "Periskope")}
        />
      </div>
      
      <SidebarNav />
    </div>
  )
}