import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, DollarSign, ShoppingBag, Users, TrendingUp, Activity } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useAxiosSecure from '../../hooks/UseAxiosSecure'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const statsRef = useRef([])
    const chartsRef = useRef(null)
    const tableRef = useRef(null)
    const hasAnimated = useRef(false)

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/stats/admin')
            return res.data
        }
    })

    const { data: withdrawalRequests = [], isLoading: withdrawalsLoading } = useQuery({
        queryKey: ['pending-withdrawals'],
        queryFn: async () => {
            const res = await axiosSecure.get('/withdrawals/pending')
            return res.data
        }
    })

    const { data: allUsers = [] } = useQuery({
        queryKey: ['all-users-for-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            return res.data
        }
    })

    // Smooth animation - runs once per session
    useEffect(() => {
        if (stats && !statsLoading && !hasAnimated.current) {
            hasAnimated.current = true

            // Stagger animation for stats cards
            gsap.fromTo(
                statsRef.current.filter(Boolean),
                {
                    y: 30,
                    opacity: 0,
                    scale: 0.95
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    clearProps: 'all' // Clean up after animation
                }
            )
        }
    }, [stats, statsLoading])

    // Chart data preparation
    const pieData = [
        { name: 'Workers', value: stats?.workerCount || 0, color: '#3b82f6' },
        { name: 'Buyers', value: stats?.buyerCount || 0, color: '#8b5cf6' }
    ]

    // Mock trend data (in production, fetch from backend)
    const trendData = [
        { month: 'Jan', users: 20, revenue: 1200 },
        { month: 'Feb', users: 35, revenue: 1800 },
        { month: 'Mar', users: 50, revenue: 2400 },
        { month: 'Apr', users: 68, revenue: 3200 },
        { month: 'May', users: 82, revenue: 4100 },
        { month: 'Jun', users: stats?.workerCount + stats?.buyerCount || 100, revenue: stats?.totalPayments || 5000 }
    ]

    // Activity data - recent withdrawals distribution
    const activityData = withdrawalRequests.slice(0, 6).map((req, idx) => ({
        name: req.workerName.split(' ')[0],
        amount: req.withdrawal_amount,
        coins: req.withdrawal_coin
    }))

    // Top coin holders
    const topUsers = allUsers
        .sort((a, b) => b.coin - a.coin)
        .slice(0, 5)
        .map(user => ({
            name: user.displayName,
            coins: user.coin,
            role: user.role
        }))

    const handleApproveWithdrawal = async (withdrawalId) => {
        try {
            const result = await Swal.fire({
                title: 'Approve Withdrawal?',
                text: 'This will process the withdrawal and deduct coins from worker.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, approve it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.patch(`/withdrawals/${withdrawalId}/approve`)
                queryClient.invalidateQueries(['pending-withdrawals'])
                queryClient.invalidateQueries(['admin-stats'])
                Swal.fire('Approved!', 'The withdrawal has been processed.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to approve withdrawal.', 'error')
        }
    }

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Workers',
            value: stats?.workerCount || 0,
            icon: Users,
            color: 'text-primary',
            bgClass: 'bg-primary/10',
            trend: '+12%'
        },
        {
            title: 'Total Buyers',
            value: stats?.buyerCount || 0,
            icon: ShoppingBag,
            color: 'text-secondary',
            bgClass: 'bg-secondary/10',
            trend: '+8%'
        },
        {
            title: 'Total Available Coins',
            value: stats?.totalCoin || 0,
            icon: DollarSign,
            color: 'text-accent',
            bgClass: 'bg-accent/10',
            trend: '+15%'
        },
        {
            title: 'Total Payments',
            value: `$${stats?.totalPayments || 0}`,
            icon: DollarSign,
            color: 'text-success',
            bgClass: 'bg-success/10',
            trend: '+23%'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-base-content/60">Platform overview and analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={stat.title}
                        ref={(el) => (statsRef.current[index] = el)}
                        className="bg-base-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-base-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${stat.bgClass} p-3 rounded-lg`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-xs font-medium text-success">{stat.trend}</span>
                        </div>
                        <p className="text-base-content/60 text-sm mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-primary" size={20} />
                        <h3 className="text-lg font-semibold">User Growth</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                            <YAxis style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsl(var(--bc) / 0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="text-success" size={20} />
                        <h3 className="text-lg font-semibold">Revenue Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                            <YAxis style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsl(var(--bc) / 0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* User Distribution */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="text-secondary" size={20} />
                        <h3 className="text-lg font-semibold">User Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Coin Holders */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-warning" size={20} />
                        <h3 className="text-lg font-semibold">Top Coin Holders</h3>
                    </div>
                    <div className="space-y-3">
                        {topUsers.map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-base-content/60 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-warning">{user.coins}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Withdrawal Requests */}
            <div ref={tableRef} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-warning" size={24} />
                    <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
                </div>

                {withdrawalsLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                ) : withdrawalRequests.length === 0 ? (
                    <div className="text-center py-12 text-base-content/60">
                        <Clock size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No pending withdrawal requests</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>Coins</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Account</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawalRequests.map((request) => (
                                    <tr key={request._id} className="hover">
                                        <td>
                                            <div>
                                                <div className="font-medium">{request.workerName}</div>
                                                <div className="text-xs text-base-content/60">{request.workerEmail}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-warning badge-sm">
                                                {request.withdrawal_coin}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-success">
                                                ${request.withdrawal_amount}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-info badge-sm">
                                                {request.payment_system}
                                            </span>
                                        </td>
                                        <td className="font-mono text-xs">{request.account_number}</td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(request.withdraw_date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleApproveWithdrawal(request._id)}
                                                className="btn btn-sm btn-success"
                                            >
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
