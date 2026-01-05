import { Bell, Trash2, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../hooks/useAuth'
import useAxiosSecure from '../hooks/useAxiosSecure'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()

    const { data: notifications = [], refetch } = useQuery({
        queryKey: ['notifications', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notifications?email=${user.email}`)
            return res.data
        },
        enabled: !!user?.email,
        refetchInterval: 10000 // Refetch every 10 seconds for real-time feel
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDeleteNotification = async (id) => {
        try {
            await axiosSecure.delete(`/notifications/${id}`)
            queryClient.invalidateQueries(['notifications'])
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    const formatTime = (time) => {
        const date = new Date(time)
        const now = new Date()
        const diff = now - date

        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-circle relative"
            >
                <Bell size={22} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50 max-h-125 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-base-300">
                            <h3 className="font-semibold text-lg">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Notification List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <Bell size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-base-300">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 hover:bg-base-200 transition-colors group"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    to={notification.actionRoute}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex-1"
                                                >
                                                    <p className="text-sm mb-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-base-content/60">
                                                        {formatTime(notification.time)}
                                                    </span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteNotification(notification._id)}
                                                    className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NotificationDropdown
