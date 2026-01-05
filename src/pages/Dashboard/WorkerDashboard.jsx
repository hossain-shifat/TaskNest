import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Clock, DollarSign, FileText, TrendingUp, Target } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import useAxiosSecure from '../../hooks/UseAxiosSecure'
import useAuth from '../../hooks/useAuth'
import gsap from 'gsap'

const WorkerDashboard = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const statsRef = useRef([])
    const hasAnimated = useRef(false)

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['worker-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions/stats/worker?email=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: approvedSubmissions = [], isLoading: submissionsLoading } = useQuery({
        queryKey: ['approved-submissions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?workerEmail=${user.email}&status=approved`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: allSubmissions = [] } = useQuery({
        queryKey: ['all-my-submissions-worker', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?workerEmail=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: userInfo } = useQuery({
        queryKey: ['user-info', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    // Smooth animation - runs once per session
    useEffect(() => {
        if (stats && !statsLoading && !hasAnimated.current) {
            hasAnimated.current = true

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
                    clearProps: 'all'
                }
            )
        }
    }, [stats, statsLoading])

    // Earnings trend - group by date
    const earningsData = approvedSubmissions
        .slice(0, 10)
        .reverse()
        .map((sub, idx) => ({
            date: new Date(sub.current_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            earnings: sub.payable_amount,
            cumulative: approvedSubmissions.slice(0, idx + 1).reduce((sum, s) => sum + s.payable_amount, 0)
        }))

    // Submission status distribution
    const statusData = [
        {
            name: 'Approved',
            value: allSubmissions.filter(s => s.status === 'approved').length,
            color: '#10b981'
        },
        {
            name: 'Pending',
            value: allSubmissions.filter(s => s.status === 'pending').length,
            color: '#f59e0b'
        },
        {
            name: 'Rejected',
            value: allSubmissions.filter(s => s.status === 'rejected').length,
            color: '#ef4444'
        }
    ]

    // Top earning tasks
    const topTasks = approvedSubmissions
        .reduce((acc, sub) => {
            const existing = acc.find(item => item.name === sub.task_title)
            if (existing) {
                existing.earnings += sub.payable_amount
                existing.count += 1
            } else {
                acc.push({
                    name: sub.task_title.substring(0, 25),
                    earnings: sub.payable_amount,
                    count: 1
                })
            }
            return acc
        }, [])
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5)

    // Performance metrics
    const approvalRate = allSubmissions.length > 0
        ? ((allSubmissions.filter(s => s.status === 'approved').length / allSubmissions.length) * 100).toFixed(1)
        : 0

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Submissions',
            value: stats?.totalSubmission || 0,
            icon: FileText,
            color: 'text-primary',
            bgClass: 'bg-primary/10',
            subtitle: `${approvalRate}% approval rate`
        },
        {
            title: 'Pending Review',
            value: stats?.pendingSubmission || 0,
            icon: Clock,
            color: 'text-warning',
            bgClass: 'bg-warning/10',
            subtitle: 'Awaiting approval'
        },
        {
            title: 'Total Earnings',
            value: `${stats?.totalEarning || 0}`,
            icon: DollarSign,
            color: 'text-success',
            bgClass: 'bg-success/10',
            subtitle: 'coins earned'
        },
        {
            title: 'Available Balance',
            value: userInfo?.coin || 0,
            icon: Target,
            color: 'text-accent',
            bgClass: 'bg-accent/10',
            subtitle: 'ready to withdraw'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
                <p className="text-base-content/60">Welcome back, {user?.displayName}! 🎉</p>
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
                        </div>
                        <p className="text-base-content/60 text-sm mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-xs text-base-content/60">{stat.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Trend */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-success" size={20} />
                        <h3 className="text-lg font-semibold">Earnings Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={earningsData}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                style={{ fontSize: '11px' }}
                                angle={-15}
                                textAnchor="end"
                                height={50}
                            />
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
                                dataKey="earnings"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorEarnings)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Submission Status */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="text-primary" size={20} />
                        <h3 className="text-lg font-semibold">Submission Status</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Earning Tasks */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="text-warning" size={20} />
                        <h3 className="text-lg font-semibold">Top Earning Tasks</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topTasks} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" style={{ fontSize: '12px' }} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                style={{ fontSize: '11px' }}
                                width={150}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsl(var(--bc) / 0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="earnings" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-5 border border-success/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-success" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">Approval Rate</p>
                            <p className="text-2xl font-bold text-success">{approvalRate}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2 mt-3">
                        <div
                            className="bg-success h-2 rounded-full transition-all duration-500"
                            style={{ width: `${approvalRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">Avg Per Task</p>
                            <p className="text-2xl font-bold text-primary">
                                {approvedSubmissions.length > 0
                                    ? Math.round(stats.totalEarning / approvedSubmissions.length)
                                    : 0} coins
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-base-content/60 mt-3">
                        Based on {approvedSubmissions.length} completed tasks
                    </p>
                </div>

                <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-5 border border-warning/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                            <Clock className="text-warning" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">This Week</p>
                            <p className="text-2xl font-bold text-warning">
                                {approvedSubmissions.filter(sub => {
                                    const weekAgo = new Date()
                                    weekAgo.setDate(weekAgo.getDate() - 7)
                                    return new Date(sub.current_date) >= weekAgo
                                }).length} tasks
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-base-content/60 mt-3">
                        Keep up the great work!
                    </p>
                </div>
            </div>

            {/* Approved Submissions Table */}
            <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="text-success" size={24} />
                    <h2 className="text-xl font-semibold">Recent Approved Submissions</h2>
                </div>

                {submissionsLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                ) : approvedSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-base-content/60">
                        <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No approved submissions yet</p>
                        <p className="text-sm mt-2">Start completing tasks to earn rewards!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Buyer</th>
                                    <th>Earned</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedSubmissions.slice(0, 10).map((submission) => (
                                    <tr key={submission._id} className="hover">
                                        <td className="font-medium max-w-xs truncate">{submission.task_title}</td>
                                        <td>{submission.buyerName}</td>
                                        <td>
                                            <span className="badge badge-success gap-1 font-semibold">
                                                <DollarSign size={14} />
                                                {submission.payable_amount}
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(submission.current_date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="badge badge-success badge-sm">
                                                {submission.status}
                                            </span>
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

export default WorkerDashboard
