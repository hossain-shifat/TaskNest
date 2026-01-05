import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import useAuth from '../../../hooks/useAuth'
import { AlertCircle, Plus, Upload, X } from 'lucide-react'
import gsap from 'gsap'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useState } from 'react'

const AddTask = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const formRef = useRef(null)
    const fileInputRef = useRef(null)
    const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm()

    const [uploadingImage, setUploadingImage] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploadedImageUrl, setUploadedImageUrl] = useState('')
    const [uploadError, setUploadError] = useState('')

    const requiredWorkers = watch('required_workers', 0)
    const payableAmount = watch('payable_amount', 0)
    const totalCost = requiredWorkers * payableAmount

    // Handle image upload to imgBB
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB')
            return
        }

        setUploadingImage(true)
        setUploadError('')

        try {
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)

            // Upload to imgBB
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_HOST}`,
                formData
            )

            if (response.data.success) {
                const imageUrl = response.data.data.display_url
                setUploadedImageUrl(imageUrl)
                setValue('task_image_url', imageUrl)
            } else {
                throw new Error('Upload failed')
            }
        } catch (error) {
            console.error('Image upload error:', error)
            setUploadError('Failed to upload image. Please try again.')
            setImagePreview(null)
        } finally {
            setUploadingImage(false)
        }
    }

    // Remove uploaded image
    const handleRemoveImage = () => {
        setImagePreview(null)
        setUploadedImageUrl('')
        setValue('task_image_url', '')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const onSubmit = async (data) => {
        // Validate image is uploaded
        if (!uploadedImageUrl) {
            setUploadError('Please upload a task image')
            return
        }

        try {
            const task = {
                task_title: data.task_title,
                task_detail: data.task_detail,
                required_workers: parseInt(data.required_workers),
                payable_amount: parseInt(data.payable_amount),
                completion_date: data.completion_date,
                submission_info: data.submission_info,
                task_image_url: uploadedImageUrl,
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
            handleRemoveImage()
            queryClient.invalidateQueries(['buyer-stats'])
            queryClient.invalidateQueries(['user-data'])
        } catch (error) {
            Swal.fire('Error!', 'Failed to create task. Please try again.', 'error')
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-1">Add New Task</h1>
                <p className="text-base-content/60 text-sm">Create a task for workers to complete</p>
            </div>

            {/* Form */}
            <div ref={formRef} className="bg-base-200 rounded-xl p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Task Title */}
                    <div className="form-control">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">Task Title *</span>
                        </label>
                        <input
                            {...register('task_title', { required: 'Task title is required' })}
                            type="text"
                            className="input input-sm input-bordered w-full"
                            placeholder="e.g., Watch my YouTube video and comment"
                        />
                        {errors.task_title && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{errors.task_title.message}</span>
                            </label>
                        )}
                    </div>

                    {/* Task Detail */}
                    <div className="form-control">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">Task Description *</span>
                        </label>
                        <textarea
                            {...register('task_detail', { required: 'Task detail is required' })}
                            className="textarea textarea-sm textarea-bordered w-full h-24 resize-none"
                            placeholder="Describe what workers need to do..."
                        />
                        {errors.task_detail && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{errors.task_detail.message}</span>
                            </label>
                        )}
                    </div>

                    {/* Workers & Payment Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">Workers Needed *</span>
                            </label>
                            <input
                                {...register('required_workers', {
                                    required: 'Required',
                                    min: { value: 1, message: 'Min 1 worker' }
                                })}
                                type="number"
                                className="input input-sm input-bordered w-full"
                                placeholder="100"
                                min="1"
                            />
                            {errors.required_workers && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error text-xs">{errors.required_workers.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">Payment (coins) *</span>
                            </label>
                            <input
                                {...register('payable_amount', {
                                    required: 'Required',
                                    min: { value: 1, message: 'Min 1 coin' }
                                })}
                                type="number"
                                className="input input-sm input-bordered w-full"
                                placeholder="10"
                                min="1"
                            />
                            {errors.payable_amount && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error text-xs">{errors.payable_amount.message}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Total Cost */}
                    {totalCost > 0 && (
                        <div className="alert alert-warning py-2 px-3">
                            <AlertCircle size={18} />
                            <span className="text-sm">
                                Total: <strong>{totalCost} coins</strong> ({requiredWorkers} × {payableAmount})
                            </span>
                        </div>
                    )}

                    {/* Completion Date */}
                    <div className="form-control">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">Deadline *</span>
                        </label>
                        <input
                            {...register('completion_date', { required: 'Deadline is required' })}
                            type="date"
                            className="input input-sm input-bordered w-full"
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.completion_date && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{errors.completion_date.message}</span>
                            </label>
                        )}
                    </div>

                    {/* Submission Info */}
                    <div className="form-control">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">Submission Requirements *</span>
                        </label>
                        <textarea
                            {...register('submission_info', { required: 'Submission info is required' })}
                            className="textarea textarea-sm textarea-bordered w-full h-20 resize-none"
                            placeholder="What should workers submit? (screenshot, link, etc.)"
                        />
                        {errors.submission_info && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{errors.submission_info.message}</span>
                            </label>
                        )}
                    </div>

                    {/* Task Image Upload */}
                    <div className="form-control">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">Task Image *</span>
                        </label>

                        {!imagePreview ? (
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="task-image-upload"
                                />
                                <label
                                    htmlFor="task-image-upload"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-base-100"
                                >
                                    <Upload className="w-10 h-10 text-base-content/40 mb-2" />
                                    <span className="text-sm text-base-content/60 font-medium">
                                        {uploadingImage ? 'Uploading...' : 'Click to upload task image'}
                                    </span>
                                    <span className="text-xs text-base-content/40 mt-1">
                                        PNG, JPG up to 5MB
                                    </span>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-40 border-2 border-base-300 rounded-lg overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Task preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                                    disabled={uploadingImage}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {uploadingImage && (
                            <div className="mt-2">
                                <progress className="progress progress-primary w-full"></progress>
                            </div>
                        )}

                        {uploadError && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{uploadError}</span>
                            </label>
                        )}

                        {/* Hidden input for form validation */}
                        <input
                            type="hidden"
                            {...register('task_image_url', {
                                required: 'Task image is required'
                            })}
                        />
                        {errors.task_image_url && !uploadedImageUrl && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error text-xs">{errors.task_image_url.message}</span>
                            </label>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="divider my-4"></div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm w-full gap-2"
                        disabled={uploadingImage}
                    >
                        <Plus size={18} />
                        Create Task
                    </button>
                </form>
            </div>

            {/* Quick Tips */}
            <div className="text-xs text-base-content/60 bg-base-200 rounded-lg p-3 space-y-1">
                <p className="font-semibold text-base-content mb-2">Tips:</p>
                <p>• Be specific in your task description to get better results</p>
                <p>• Set realistic deadlines for task completion</p>
                <p>• Clearly state what proof of completion you need</p>
                <p>• Upload an attractive image to get more workers interested</p>
            </div>
        </div>
    )
}

export default AddTask
