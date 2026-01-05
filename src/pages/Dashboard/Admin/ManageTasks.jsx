import React, { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Trash2 } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const ManageTasks = () => {
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const tableRef = useRef(null)

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['all-tasks'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tasks')
            return res.data
        }
    })

    useEffect(() => {
        if (tasks.length > 0 && !isLoading) {
            gsap.from(tableRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            })
        }
    }, [tasks, isLoading])

    const handleDelete = async (taskId, taskTitle) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Task?',
                text: `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.delete(`/tasks/admin/${taskId}`)
                queryClient.invalidateQueries(['all-tasks'])
                Swal.fire('Deleted!', 'Task has been deleted.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete task.', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Manage Tasks</h1>
                <p className="text-base-content/60">View and manage all platform tasks</p>
            </div>

            {/* Tasks Table */}
            <div ref={tableRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                {tasks.length === 0 ? (
                    <div className="text-center py-16 text-base-content/60">
                        <FileText size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No tasks found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Buyer</th>
                                    <th>Workers Needed</th>
                                    <th>Payable Amount</th>
                                    <th>Completion Date</th>
                                    <th>Created Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id} className="hover">
                                        <td className="font-medium max-w-xs truncate" title={task.task_title}>
                                            {task.task_title}
                                        </td>
                                        <td>{task.buyerName}</td>
                                        <td>
                                            <span className="badge badge-info">
                                                {task.required_workers}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-success">
                                                {task.payable_amount} coins
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(task.completion_date).toLocaleDateString()}
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(task._id, task.task_title)}
                                                className="btn btn-sm btn-error"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Total Tasks</p>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Active Tasks</p>
                    <p className="text-2xl font-bold">
                        {tasks.filter(t => t.required_workers > 0).length}
                    </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Total Workers Needed</p>
                    <p className="text-2xl font-bold">
                        {tasks.reduce((sum, t) => sum + t.required_workers, 0)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ManageTasks
