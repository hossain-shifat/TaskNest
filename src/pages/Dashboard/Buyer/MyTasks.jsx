import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, FileText, Trash2, X } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const MyTasks = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const tableRef = useRef(null)
    const [editingTask, setEditingTask] = useState(null)
    const [formData, setFormData] = useState({
        task_title: '',
        task_detail: '',
        submission_info: ''
    })

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['my-tasks', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks?buyerEmail=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    // useEffect(() => {
    //     if (tasks.length > 0 && !isLoading) {
    //         gsap.from(tableRef.current, {
    //             y: 30,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [tasks, isLoading])

    const handleEdit = (task) => {
        setEditingTask(task)
        setFormData({
            task_title: task.task_title,
            task_detail: task.task_detail,
            submission_info: task.submission_info
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axiosSecure.patch(`/tasks/${editingTask._id}`, formData)
            Swal.fire('Success!', 'Task updated successfully!', 'success')
            setEditingTask(null)
            queryClient.invalidateQueries(['my-tasks'])
        } catch (error) {
            Swal.fire('Error!', 'Failed to update task.', 'error')
        }
    }

    const handleDelete = async (taskId, task) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Task?',
                text: 'Unused coins will be refunded to your account.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.delete(`/tasks/${taskId}`)
                Swal.fire('Deleted!', 'Task has been deleted and coins refunded.', 'success')
                queryClient.invalidateQueries(['my-tasks'])
                queryClient.invalidateQueries(['user-data'])
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
                <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
                <p className="text-base-content/60">Manage all your created tasks</p>
            </div>

            {/* Tasks Table */}
            <div ref={tableRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                {tasks.length === 0 ? (
                    <div className="text-center py-16 text-base-content/60">
                        <FileText size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No tasks created yet</p>
                        <p className="text-sm mt-2">Start by creating your first task!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Workers Needed</th>
                                    <th>Payable Amount</th>
                                    <th>Completion Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id} className="hover">
                                        <td className="font-medium">{task.task_title}</td>
                                        <td>
                                            <span className="badge badge-info">
                                                {task.required_workers} workers
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
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(task)}
                                                    className="btn btn-sm btn-warning"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task._id, task)}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    <Trash2 size={16} />
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

            {/* Edit Modal */}
            {editingTask && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Edit Task</h3>
                            <button
                                onClick={() => setEditingTask(null)}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Task Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.task_title}
                                    onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Task Detail</span>
                                </label>
                                <textarea
                                    value={formData.task_detail}
                                    onChange={(e) => setFormData({ ...formData, task_detail: e.target.value })}
                                    className="textarea textarea-bordered w-full h-32"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Submission Info</span>
                                </label>
                                <textarea
                                    value={formData.submission_info}
                                    onChange={(e) => setFormData({ ...formData, submission_info: e.target.value })}
                                    className="textarea textarea-bordered w-full h-24"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Update Task
                            </button>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setEditingTask(null)}></div>
                </div>
            )}
        </div>
    )
}

export default MyTasks
