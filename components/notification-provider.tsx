"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (message: string, type?: Notification["type"]) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((message: string, type: Notification["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification = { id, message, type }

    setNotifications((prev) => [...prev, notification])

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    }
    return icons[type]
  }

  const getNotificationColor = (type: Notification["type"]) => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    }
    return colors[type]
  }

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${getNotificationColor(notification.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80 animate-in slide-in-from-right duration-300`}
          >
            <i className={getNotificationIcon(notification.type)} />
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
