import React from 'react'
import { Navigate, useLocation } from 'react-router'
import useAuth from '../hooks/useAuth'
import useRole from '../hooks/useRole'

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const { role, roleLoading } = useRole()
    const location = useLocation()

    if (loading || roleLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    if (user && role === 'admin') {
        return children
    }

    return <Navigate to="/login" state={{ from: location }} replace />
}

export default AdminRoute
