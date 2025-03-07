"use client"

import type React from "react"

import { useState } from "react"
import {
  RefreshCw,
  HelpCircle,
  Phone,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Clock,
  Mic,
  Send,
  ImageIcon,
  Calendar,
} from "lucide-react"
import type { Chat, User } from "@/lib/types"
import { Avatar } from "@/components/custom/avatar"
import { Button } from "@/components/custom/button"
import { Input } from "@/components/custom/input"
import { cn } from "@/lib/utils"

interface ChatAreaProps {
  chat: Chat | null
  onSendMessage: (content: string) => void
  currentUser: User | undefined
}

export default function ChatArea({ chat, onSendMessage, currentUser }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
          <p className="text-gray-500">Choose from your existing conversations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={chat.avatar} fallback={chat.name.charAt(0)} alt={chat.name} size="md" />
          <div>
            <div className="font-medium">{chat.name}</div>
            {chat.participants && <div className="text-xs text-gray-500">{chat.participants.join(", ")}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="text-sm text-gray-500">5 / 6 phones</div>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chat.messages.map((message) => {
          const isCurrentUser = message.sender.name === currentUser?.name

          return (
            <div key={message.id} className={cn("mb-4 max-w-[70%]", isCurrentUser ? "ml-auto" : "mr-auto")}>
              <div className="flex items-start gap-2">
                {!isCurrentUser && (
                  <Avatar
                    src={message.sender.avatar}
                    fallback={message.sender.name.charAt(0)}
                    alt={message.sender.name}
                    size="sm"
                    className="mt-1"
                  />
                )}
                <div
                  className={cn("rounded-lg p-3", isCurrentUser ? "bg-green-100 text-green-900" : "bg-white border")}
                >
                  {!isCurrentUser && (
                    <div className="font-medium text-sm text-green-600 mb-1">{message.sender.name}</div>
                  )}
                  <div>{message.content}</div>
                  <div className={cn("text-xs mt-1", isCurrentUser ? "text-green-700" : "text-gray-500")}>
                    {message.timestamp instanceof Date
                      ? new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }).format(message.timestamp)
                      : "12:07"}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" className="rounded-full">
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Private Note
          </Button>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Message..."
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon">
            <Clock className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-full h-10 w-10 p-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

