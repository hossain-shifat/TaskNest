import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, DollarSign, FileText, X, TrendingUp, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import gsap from 'gsap'
import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/UseAxiosSecure'

const BuyerDashboard = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const statsRef = useRef([])
    const hasAnimated = useRef(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['buyer-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks/stats/buyer?email=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: pendingSubmissions = [], isLoading: submissionsLoading } = useQuery({
        queryKey: ['pending-submissions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?buyerEmail=${user.email}&status=pending`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: myTasks = [] } = useQuery({
        queryKey: ['my-tasks', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks?buyerEmail=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: allSubmissions = [] } = useQuery({
        queryKey: ['all-my-submissions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?buyerEmail=${user.email}`)
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

    // Submission status distribution
    const submissionStatusData = [
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

    // Task completion trend (mock data based on real tasks)
    const taskTrendData = myTasks.slice(0, 6).map((task, idx) => ({
        name: task.task_title.substring(0, 15) + '...',
        completed: Math.max(0, task.required_workers - 10),
        remaining: Math.min(task.required_workers, 10)
    }))

    // Spending by task
    const spendingData = myTasks.slice(0, 5).map(task => ({
        name: task.task_title.substring(0, 20),
        amount: task.required_workers * task.payable_amount
    }))

    const handleApprove = async (submissionId) => {
        try {
            const result = await Swal.fire({
                title: 'Approve Submission?',
                text: 'This will credit the worker with the payable amount.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, approve it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.patch(`/submissions/${submissionId}/approve`)
                queryClient.invalidateQueries(['pending-submissions'])
                queryClient.invalidateQueries(['buyer-stats'])
                queryClient.invalidateQueries(['all-my-submissions'])
                Swal.fire('Approved!', 'The submission has been approved.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to approve submission.', 'error')
        }
    }

    const handleReject = async (submissionId) => {
        try {
            const result = await Swal.fire({
                title: 'Reject Submission?',
                text: 'This will increase the required workers count.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, reject it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.patch(`/submissions/${submissionId}/reject`)
                queryClient.invalidateQueries(['pending-submissions'])
                queryClient.invalidateQueries(['all-my-submissions'])
                setSelectedSubmission(null)
                Swal.fire('Rejected!', 'The submission has been rejected.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to reject submission.', 'error')
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
            title: 'Total Tasks',
            value: stats?.taskCount || 0,
            icon: FileText,
            color: 'text-primary',
            bgClass: 'bg-primary/10',
            change: '+5'
        },
        {
            title: 'Pending Reviews',
            value: pendingSubmissions.length || 0,
            icon: Clock,
            color: 'text-warning',
            bgClass: 'bg-warning/10',
            change: `${pendingSubmissions.length}`
        },
        {
            title: 'Total Spent',
            value: `$${stats?.totalPayment || 0}`,
            icon: DollarSign,
            color: 'text-success',
            bgClass: 'bg-success/10',
            change: '+12%'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
                <p className="text-base-content/60">Manage your tasks and track performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <span className="text-xs font-medium text-base-content/60">{stat.change}</span>
                        </div>
                        <p className="text-base-content/60 text-sm mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submission Status */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="text-success" size={20} />
                        <h3 className="text-lg font-semibold">Submission Status</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={submissionStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {submissionStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Spending */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="text-primary" size={20} />
                        <h3 className="text-lg font-semibold">Spending by Task</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={spendingData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                style={{ fontSize: '11px' }}
                                angle={-15}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsl(var(--bc) / 0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Completion Progress */}
                <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-accent" size={20} />
                        <h3 className="text-lg font-semibold">Task Completion Progress</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={taskTrendData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" style={{ fontSize: '12px' }} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                style={{ fontSize: '11px' }}
                                width={120}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsl(var(--bc) / 0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                            <Bar dataKey="remaining" stackId="a" fill="#f59e0b" name="Remaining" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Task To Review */}
            <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-warning" size={24} />
                    <h2 className="text-xl font-semibold">Tasks To Review</h2>
                </div>

                {submissionsLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                ) : pendingSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-base-content/60">
                        <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No pending submissions to review</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>Task</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingSubmissions.map((submission) => (
                                    <tr key={submission._id} className="hover">
                                        <td className="font-medium">{submission.workerName}</td>
                                        <td className="max-w-xs truncate">{submission.task_title}</td>
                                        <td>
                                            <span className="badge badge-warning gap-1">
                                                {submission.payable_amount} coins
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(submission.current_date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedSubmission(submission)}
                                                    className="btn btn-sm btn-info btn-outline"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(submission._id)}
                                                    className="btn btn-sm btn-success"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(submission._id)}
                                                    className="btn btn-sm btn-error btn-outline"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Submission Details Modal */}
            {selectedSubmission && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Submission Details</h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Worker</span>
                                    </label>
                                    <p className="p-3 bg-base-200 rounded-lg">{selectedSubmission.workerName}</p>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Amount</span>
                                    </label>
                                    <p className="p-3 bg-base-200 rounded-lg font-bold text-success">
                                        {selectedSubmission.payable_amount} coins
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Task Title</span>
                                </label>
                                <p className="p-3 bg-base-200 rounded-lg">{selectedSubmission.task_title}</p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Submission Details</span>
                                </label>
                                <p className="p-3 bg-base-200 rounded-lg whitespace-pre-wrap min-h-[100px]">
                                    {selectedSubmission.submission_details}
                                </p>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={() => {
                                        handleApprove(selectedSubmission._id)
                                        setSelectedSubmission(null)
                                    }}
                                    className="btn btn-success flex-1"
                                >
                                    Approve Submission
                                </button>
                                <button
                                    onClick={() => handleReject(selectedSubmission._id)}
                                    className="btn btn-error flex-1"
                                >
                                    Reject Submission
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setSelectedSubmission(null)}></div>
                </div>
            )}
        </div>
    )
}

export default BuyerDashboard
