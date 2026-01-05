import React from 'react'
import AdminDashboard from './AdminDashboard'
import BuyerDashboard from './BuyerDashboard'
import WorkerDashboard from './WorkerDashboard'
import useRole from '../../hooks/useRole'

const DashboardHome = () => {
    const { role, roleLoading } = useRole()

    if (roleLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    if (role === 'admin') {
        return <AdminDashboard />
    } else if (role === 'buyer') {
        return <BuyerDashboard />
    } else {
        return <WorkerDashboard />
    }
}

export default DashboardHome
