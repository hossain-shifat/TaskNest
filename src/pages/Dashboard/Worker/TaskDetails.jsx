import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import { Calendar, DollarSign, FileText, User, Users } from 'lucide-react'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const TaskDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [submissionDetails, setSubmissionDetails] = useState('')
    const contentRef = useRef(null)

    const { data: task, isLoading } = useQuery({
        queryKey: ['task-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks/${id}`)
            return res.data
        }
    })

    // useEffect(() => {
    //     if (task && !isLoading) {
    //         gsap.from(contentRef.current, {
    //             y: 50,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [task, isLoading])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!submissionDetails.trim()) {
            Swal.fire('Error!', 'Please provide submission details.', 'error')
            return
        }

        try {
            const submission = {
                task_id: task._id,
                task_title: task.task_title,
                payable_amount: task.payable_amount,
                workerEmail: user.email,
                submission_details: submissionDetails,
                workerName: user.displayName,
                buyerName: task.buyerName,
                buyerEmail: task.buyerEmail
            }

            await axiosSecure.post('/submissions', submission)

            Swal.fire({
                title: 'Success!',
                text: 'Your submission has been sent for review.',
                icon: 'success',
                confirmButtonText: 'Go to My Submissions'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/my-submissions')
                }
            })

            setSubmissionDetails('')
            queryClient.invalidateQueries(['available-tasks'])
        } catch (error) {
            Swal.fire('Error!', 'Failed to submit. Please try again.', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    if (!task) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-error">Task not found</p>
            </div>
        )
    }

    return (
        <div ref={contentRef} className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Task Details</h1>
                <p className="text-base-content/60">Review the task and submit your work</p>
            </div>

            {/* Task Information Card */}
            <div className="bg-base-200 rounded-lg overflow-hidden shadow-lg">
                {/* Task Image */}
                <div className="h-64 overflow-hidden">
                    <img
                        src={task.task_image_url}
                        alt={task.task_title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Task Details */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{task.task_title}</h2>
                        <div className="badge badge-success gap-2 py-3 px-4">
                            <DollarSign size={18} />
                            <span className="font-semibold text-base">{task.payable_amount} coins</span>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-base-300 rounded-lg">
                            <User className="text-primary" size={20} />
                            <div>
                                <p className="text-xs text-base-content/60">Buyer</p>
                                <p className="font-semibold">{task.buyerName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-base-300 rounded-lg">
                            <Calendar className="text-warning" size={20} />
                            <div>
                                <p className="text-xs text-base-content/60">Deadline</p>
                                <p className="font-semibold">
                                    {new Date(task.completion_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-base-300 rounded-lg">
                            <Users className="text-info" size={20} />
                            <div>
                                <p className="text-xs text-base-content/60">Workers Needed</p>
                                <p className="font-semibold">{task.required_workers}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-base-300 rounded-lg">
                            <DollarSign className="text-success" size={20} />
                            <div>
                                <p className="text-xs text-base-content/60">Reward</p>
                                <p className="font-semibold">{task.payable_amount} coins</p>
                            </div>
                        </div>
                    </div>

                    {/* Task Description */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold text-lg flex items-center gap-2">
                                <FileText size={20} />
                                Task Description
                            </span>
                        </label>
                        <div className="p-4 bg-base-300 rounded-lg">
                            <p className="whitespace-pre-wrap">{task.task_detail}</p>
                        </div>
                    </div>

                    {/* Submission Info */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold text-lg flex items-center gap-2">
                                <FileText size={20} />
                                What to Submit
                            </span>
                        </label>
                        <div className="p-4 bg-base-300 rounded-lg">
                            <p className="whitespace-pre-wrap">{task.submission_info}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Form */}
            <div className="bg-base-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Submit Your Work</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Submission Details</span>
                        </label>
                        <textarea
                            value={submissionDetails}
                            onChange={(e) => setSubmissionDetails(e.target.value)}
                            className="textarea textarea-bordered w-full h-32"
                            placeholder="Enter your submission details here (e.g., screenshot link, proof of completion, etc.)"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TaskDetails
