// lib/indexedDB.ts
import type { Chat } from "@/lib/types"

// Check if IndexedDB is supported and the database exists
export async function checkDB(): Promise<string> {
  console.log("Checking for IndexedDB support...")
  if (!window.indexedDB) {
    console.error("Your browser doesn't support IndexedDB")
    return "IndexedDB not supported"
  }
  
  console.log("IndexedDB is supported")
  return new Promise((resolve) => {
    const request = indexedDB.open("chatDB", 1)
    
    request.onupgradeneeded = (event) => {
      const db = request.result
      console.log("Database upgrade needed, creating object store")
      if (!db.objectStoreNames.contains("chats")) {
        const chatStore = db.createObjectStore("chats", { keyPath: "id" })
        chatStore.createIndex("name", "name", { unique: false })
        chatStore.createIndex("timestamp", "lastMessage.timestamp", { unique: false })
        console.log("Created 'chats' object store with indexes")
      }
    }
    
    request.onsuccess = (event) => {
      const db = request.result
      console.log("Successfully opened database:", db.name)
      console.log("Object stores:", Array.from(db.objectStoreNames))
      try {
        const tx = db.transaction("chats", "readonly")
        const store = tx.objectStore("chats")
        const countRequest = store.count()
        
        countRequest.onsuccess = () => {
          const count = countRequest.result
          console.log(`Database contains ${count} chats`)
          db.close()
          resolve(`DB ready, contains ${count} chats`)
        }
        
        countRequest.onerror = () => {
          console.error("Error counting chats:", countRequest.error)
          db.close()
          resolve("DB error counting chats")
        }
      } catch (error) {
        console.error("Transaction error during check:", error)
        db.close()
        resolve(`DB transaction error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    
    request.onerror = (event) => {
      console.error("Error opening database:", request.error)
      resolve(`DB open error: ${request.error instanceof Error ? request.error.message : String(request.error)}`)
    }
  })
}

export function openDB(): Promise<IDBDatabase> {
  console.log("Opening database")
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chatDB", 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      console.log("Database upgrade needed, creating object store")
      if (!db.objectStoreNames.contains("chats")) {
        const chatStore = db.createObjectStore("chats", { keyPath: "id" })
        chatStore.createIndex("name", "name", { unique: false })
        chatStore.createIndex("timestamp", "lastMessage.timestamp", { unique: false })
        console.log("Created 'chats' object store with indexes")
      }
    }

    request.onsuccess = () => {
      console.log("Database opened successfully")
      resolve(request.result)
    }
    
    request.onerror = () => {
      console.error("Error opening database:", request.error)
      reject(request.error)
    }
  })
}

// Inspect the database contents
export async function inspectDatabase(): Promise<void> {
  console.log("Inspecting database")
  const request = indexedDB.open("chatDB", 1)
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const db = request.result
      try {
        const tx = db.transaction("chats", "readonly")
        const store = tx.objectStore("chats")
        const countRequest = store.count()
        
        countRequest.onsuccess = () => {
          const count = countRequest.result
          console.log("Total chats in database:", count)
          
          if (count > 0) {
            const getAllRequest = store.getAll()
            getAllRequest.onsuccess = () => {
              console.log("All chats in database:", getAllRequest.result)
              console.log("Chat IDs:", getAllRequest.result.map(chat => chat.id).join(", "))
              db.close()
              resolve()
            }
            
            getAllRequest.onerror = () => {
              console.error("Error getting all chats:", getAllRequest.error)
              db.close()
              reject(getAllRequest.error)
            }
          } else {
            console.log("No chats found in database")
            db.close()
            resolve()
          }
        }
        
        countRequest.onerror = () => {
          console.error("Error counting chats:", countRequest.error)
          db.close()
          reject(countRequest.error)
        }
      } catch (error) {
        console.error("Transaction error during inspection:", error)
        db.close()
        reject(error)
      }
    }
    
    request.onerror = () => {
      console.error("Error opening database for inspection:", request.error)
      reject(request.error)
    }
  })
}

// Test IndexedDB with simple data
export async function testIndexedDB(): Promise<string> {
  console.log("Running IndexedDB test")
  try {
    const db = await openDB()
    const tx = db.transaction("chats", "readwrite")
    const store = tx.objectStore("chats")
    
    const testData = {
      id: "test-chat",
      name: "Test Chat",
      messages: [],
      lastMessage: null,
      tags: []
    }
    
    console.log("Adding test data:", testData)
    
    return new Promise((resolve, reject) => {
      const putRequest = store.put(testData)
      
      putRequest.onsuccess = () => {
        console.log("Test data saved successfully")
        
        const getRequest = store.get("test-chat")
        
        getRequest.onsuccess = () => {
          console.log("Retrieved test data:", getRequest.result)
          if (getRequest.result && getRequest.result.id === "test-chat") {
            tx.oncomplete = () => {
              db.close()
              resolve("Test successful")
            }
          } else {
            tx.oncomplete = () => {
              db.close()
              resolve("Test failed: Data not retrieved correctly")
            }
          }
        }
        
        getRequest.onerror = () => {
          console.error("Error retrieving test data:", getRequest.error)
          tx.oncomplete = () => {
            db.close()
            resolve(`Test failed: ${getRequest.error instanceof Error ? getRequest.error.message : String(getRequest.error)}`)
          }
        }
      }
      
      putRequest.onerror = () => {
        console.error("Error saving test data:", putRequest.error)
        tx.oncomplete = () => {
          db.close()
          resolve(`Test failed: ${putRequest.error instanceof Error ? putRequest.error.message : String(putRequest.error)}`)
        }
      }
    })
  } catch (error) {
    console.error("IndexedDB test error:", error)
    return `Test error: ${error instanceof Error ? error.message : String(error)}`
  }
}

// Helper function to clear store
async function clearStore(store: IDBObjectStore): Promise<void> {
  console.log("Clearing object store")
  return new Promise((resolve, reject) => {
    const request = store.clear()
    request.onsuccess = () => {
      console.log("Store cleared successfully")
      resolve()
    }
    request.onerror = () => {
      console.error("Error clearing store:", request.error)
      reject(request.error)
    }
  })
}

export async function saveChats(chats: Chat[]): Promise<void> {
  console.log("Attempting to save chats, count:", chats.length)
  try {
    const db = await openDB()
    console.log("Database opened for saving")
    const tx = db.transaction("chats", "readwrite")
    const store = tx.objectStore("chats")
    
    // Clear existing chats first
    await clearStore(store)
    
    // Add each chat with logging
    const savePromises = chats.map(chat => {
      return new Promise<void>((resolve, reject) => {
        console.log("Saving chat:", chat.id)
        const request = store.put(chat)
        
        request.onsuccess = () => {
          console.log("Chat saved successfully:", chat.id)
          resolve()
        }
        
        request.onerror = () => {
          console.error("Error saving chat:", chat.id, request.error)
          reject(request.error)
        }
      })
    })
    
    await Promise.all(savePromises)
    console.log("All chats saved successfully")
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log("Transaction completed successfully")
        db.close()
        resolve()
      }
      
      tx.onerror = () => {
        console.error("Transaction error:", tx.error)
        reject(tx.error)
      }
    })
  } catch (error) {
    console.error("Error in saveChats:", error)
    throw error
  }
}

export async function getChats(): Promise<Chat[]> {
  console.log("Getting all chats from IndexedDB")
  try {
    const db = await openDB()
    console.log("Database opened for reading")
    const tx = db.transaction("chats", "readonly")
    const store = tx.objectStore("chats")
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      
      request.onsuccess = () => {
        const chats = request.result || []
        console.log(`Retrieved ${chats.length} chats`)
        if (chats.length > 0) {
          console.log("First chat ID:", chats[0].id)
        }
        resolve(chats)
      }
      
      request.onerror = () => {
        console.error("Error getting chats:", request.error)
        reject(request.error)
      }
      
      tx.oncomplete = () => {
        console.log("Read transaction completed")
        db.close()
      }
    })
  } catch (error) {
    console.error("Error in getChats:", error)
    return []
  }
}

export async function getChat(id: string): Promise<Chat | null> {
  console.log("Getting chat by ID:", id)
  try {
    const db = await openDB()
    const tx = db.transaction("chats", "readonly")
    const store = tx.objectStore("chats")
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      
      request.onsuccess = () => {
        const chat = request.result
        console.log("Retrieved chat:", chat ? chat.id : "not found")
        resolve(chat || null)
      }
      
      request.onerror = () => {
        console.error("Error getting chat:", request.error)
        reject(request.error)
      }
      
      tx.oncomplete = () => db.close()
    })
  } catch (error) {
    console.error("Error in getChat:", error)
    return null
  }
}

export async function deleteChat(id: string): Promise<void> {
  console.log("Deleting chat:", id)
  try {
    const db = await openDB()
    const tx = db.transaction("chats", "readwrite")
    const store = tx.objectStore("chats")
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      
      request.onsuccess = () => {
        console.log("Chat deleted successfully:", id)
        resolve()
      }
      
      request.onerror = () => {
        console.error("Error deleting chat:", request.error)
        reject(request.error)
      }
      
      tx.oncomplete = () => db.close()
    })
  } catch (error) {
    console.error("Error in deleteChat:", error)
    throw error
  }
}