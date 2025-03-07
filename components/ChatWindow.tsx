"use client"

import { useState, useEffect } from "react"
import ChatSidebar from "./chat-sidebar"
import ChatArea from "./chatarea"
import SidebarNav from "./sidebar"
import type { Chat, Message, User } from "@/lib/types"
import { initialChats, initialUsers } from "@/lib/data"
import { Menu } from "lucide-react"
import { Button } from "@/components/custom/button"
import { 
  getChats, 
  saveChats, 
  checkDB, 
  inspectDatabase, 
  testIndexedDB 
} from "@/lib/indexedDB"

export default function ChatInterface() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [users] = useState<User[]>(initialUsers)
  const [filter, setFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltered, setIsFiltered] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState("Initializing...")

  // Check database early during initialization
  useEffect(() => {
    checkDB().then(status => {
      console.log("Initial DB check:", status)
      setDbStatus(status)
    })
    
    // Run a test to verify IndexedDB is working
    testIndexedDB().then(result => {
      console.log("IndexedDB test result:", result)
    })
  }, [])

  useEffect(() => {
    async function loadChats() {
      setIsLoading(true)
      try {
        console.log("Starting to load chats from IndexedDB")
        // Inspect the database content before loading
        await inspectDatabase()
        
        const storedChats = await getChats()
        console.log("Raw result from getChats():", storedChats)
        
        if (storedChats && storedChats.length > 0) {
          console.log("Found stored chats, count:", storedChats.length)
          setChats(storedChats)
          setActiveChat(storedChats[0])
        } else {
          console.log("No stored chats found, using initial chats")
          setChats(initialChats)
          setActiveChat(initialChats[0])
          
          // Since no chats were found, let's save the initial chats right away
          console.log("Saving initial chats to IndexedDB")
          await saveChats(initialChats)
          
          // Verify the save worked
          await inspectDatabase()
        }
      } catch (error) {
        console.error("Error loading chats:", error)
        setDbStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setChats(initialChats)
        setActiveChat(initialChats[0])
      } finally {
        setIsLoading(false)
      }
    }
    loadChats()
  }, [])

  useEffect(() => {
    if (chats.length > 0 && !isLoading) {
      console.log("Chats changed, scheduling save")
      const saveTimeout = setTimeout(async () => {
        try {
          console.log("Saving chats, count:", chats.length)
          await saveChats(chats)
          console.log("Chats saved successfully")
          
          // Verify the save
          await inspectDatabase()
          setDbStatus("Chats saved successfully")
        } catch (error) {
          console.error("Error saving chats:", error)
          setDbStatus(`Save error: ${error instanceof Error ? error.message : String(error)}`)
        }
      }, 500) // Save after 500ms of inactivity
      
      return () => {
        console.log("Clearing save timeout")
        clearTimeout(saveTimeout)
      }
    }
  }, [chats, isLoading])

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && isSidebarVisible) {
        setIsSidebarVisible(false)
      } else if (!mobile && !isSidebarVisible) {
        setIsSidebarVisible(true)
      }
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
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

    console.log("Adding new message to chat:", activeChat.id)
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

  // Debugging UI button to force database inspection
  const forceInspectDB = async () => {
    try {
      await inspectDatabase()
      setDbStatus("Database inspection complete")
    } catch (error) {
      setDbStatus(`Inspection error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center flex-col gap-4">
        <p>Loading chats...</p>
        <p className="text-sm text-gray-500">{dbStatus}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-background relative">
      {/* Debug button - remove in production */}
      <div className="absolute top-0 right-0 z-50 bg-gray-100 p-2 text-xs">
        <p>DB: {dbStatus}</p>
        <button 
          onClick={forceInspectDB}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Inspect DB
        </button>
      </div>
      
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