import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const AddTask = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const formRef = useRef(null)
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

    const requiredWorkers = watch('required_workers', 0)
    const payableAmount = watch('payable_amount', 0)
    const totalCost = requiredWorkers * payableAmount

    // useEffect(() => {
    //     gsap.from(formRef.current, {
    //         y: 50,
    //         opacity: 0,
    //         duration: 0.6,
    //         ease: 'power3.out'
    //     })
    // }, [])

    const onSubmit = async (data) => {
        try {
            const task = {
                task_title: data.task_title,
                task_detail: data.task_detail,
                required_workers: parseInt(data.required_workers),
                payable_amount: parseInt(data.payable_amount),
                completion_date: data.completion_date,
                submission_info: data.submission_info,
                task_image_url: data.task_image_url,
                buyerEmail: user.email,
                buyerName: user.displayName
            }

            const res = await axiosSecure.post('/tasks', task)

            if (res.data.message === 'insufficient coin') {
                Swal.fire({
                    title: 'Insufficient Coins!',
                    text: 'Not available Coin. Purchase Coin',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Purchase Coins',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/dashboard/purchase-coin')
                    }
                })
                return
            }

            Swal.fire('Success!', 'Task created successfully!', 'success')
            reset()
            queryClient.invalidateQueries(['buyer-stats'])
            queryClient.invalidateQueries(['user-data'])
        } catch (error) {
            Swal.fire('Error!', 'Failed to create task. Please try again.', 'error')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Add New Task</h1>
                <p className="text-base-content/60">Create a new task for workers to complete</p>
            </div>

            {/* Form Card */}
            <div ref={formRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Task Title */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Task Title</span>
                        </label>
                        <input
                            {...register('task_title', { required: 'Task title is required' })}
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="e.g., Watch my YouTube video and make a comment"
                        />
                        {errors.task_title && (
                            <span className="text-error text-sm mt-1">{errors.task_title.message}</span>
                        )}
                    </div>

                    {/* Task Detail */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Task Detail</span>
                        </label>
                        <textarea
                            {...register('task_detail', { required: 'Task detail is required' })}
                            className="textarea textarea-bordered w-full h-32"
                            placeholder="Provide detailed description of the task"
                        />
                        {errors.task_detail && (
                            <span className="text-error text-sm mt-1">{errors.task_detail.message}</span>
                        )}
                    </div>

                    {/* Grid Layout for Numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Required Workers */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Required Workers</span>
                            </label>
                            <input
                                {...register('required_workers', {
                                    required: 'Number of workers is required',
                                    min: { value: 1, message: 'At least 1 worker required' }
                                })}
                                type="number"
                                className="input input-bordered w-full"
                                placeholder="e.g., 100"
                                min="1"
                            />
                            {errors.required_workers && (
                                <span className="text-error text-sm mt-1">{errors.required_workers.message}</span>
                            )}
                        </div>

                        {/* Payable Amount */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Payable Amount (coins)</span>
                            </label>
                            <input
                                {...register('payable_amount', {
                                    required: 'Payable amount is required',
                                    min: { value: 1, message: 'Amount must be at least 1 coin' }
                                })}
                                type="number"
                                className="input input-bordered w-full"
                                placeholder="e.g., 10"
                                min="1"
                            />
                            {errors.payable_amount && (
                                <span className="text-error text-sm mt-1">{errors.payable_amount.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Total Cost Display */}
                    {totalCost > 0 && (
                        <div className="alert alert-info">
                            <span className="font-semibold">
                                Total Cost: {totalCost} coins ({requiredWorkers} workers × {payableAmount} coins)
                            </span>
                        </div>
                    )}

                    {/* Completion Date */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Completion Date</span>
                        </label>
                        <input
                            {...register('completion_date', { required: 'Completion date is required' })}
                            type="date"
                            className="input input-bordered w-full"
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.completion_date && (
                            <span className="text-error text-sm mt-1">{errors.completion_date.message}</span>
                        )}
                    </div>

                    {/* Submission Info */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Submission Info</span>
                        </label>
                        <textarea
                            {...register('submission_info', { required: 'Submission info is required' })}
                            className="textarea textarea-bordered w-full h-24"
                            placeholder="What should workers submit? (e.g., screenshot, proof of completion)"
                        />
                        {errors.submission_info && (
                            <span className="text-error text-sm mt-1">{errors.submission_info.message}</span>
                        )}
                    </div>

                    {/* Task Image URL */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Task Image URL</span>
                        </label>
                        <input
                            {...register('task_image_url', { required: 'Task image URL is required' })}
                            type="url"
                            className="input input-bordered w-full"
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.task_image_url && (
                            <span className="text-error text-sm mt-1">{errors.task_image_url.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-full">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddTask
