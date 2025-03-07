export interface User {
    id: string
    name: string
    avatar?: string
    phone?: string
  }
  
  export interface Message {
    id: string
    content: string
    sender: User
    timestamp: Date | string
    status: "sent" | "delivered" | "read"
  }
  
  export interface Chat {
    id: string
    name: string
    avatar?: string
    participants?: string[]
    lastMessage?: Message
    lastMessageDate?: string
    preview?: string
    messages: Message[]
    unreadCount?: number
    tags: string[]
    phone?: string
  }
  
  