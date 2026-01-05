import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, DollarSign, FileText } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'

const MySubmissions = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const tableRef = useRef(null)

    const { data, isLoading } = useQuery({
        queryKey: ['my-submissions', user?.email, page, limit],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/submissions/paginated?email=${user.email}&page=${page}&limit=${limit}`
            )
            return res.data
        },
        enabled: !!user?.email,
        keepPreviousData: true
    })

    const submissions = data?.submissions || []
    const total = data?.total || 0
    const totalPages = data?.totalPages || 0

    // useEffect(() => {
    //     if (submissions.length > 0 && !isLoading) {
    //         gsap.from(tableRef.current, {
    //             y: 30,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [submissions, isLoading, page])

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-error'
        }
        return (
            <span className={`badge ${statusClasses[status]} font-semibold`}>
                {status}
            </span>
        )
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
                <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
                <p className="text-base-content/60">
                    Track your submitted tasks and their status
                </p>
            </div>

            {/* Submissions Table */}
            <div ref={tableRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                {submissions.length === 0 ? (
                    <div className="text-center py-16 text-base-content/60">
                        <FileText size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No submissions yet</p>
                        <p className="text-sm mt-2">Start completing tasks to see your submissions here!</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Task Title</th>
                                        <th>Buyer Name</th>
                                        <th>Payable Amount</th>
                                        <th>Status</th>
                                        <th>Submission Date</th>
                                        <th>Submission Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className="hover">
                                            <td className="font-medium">{submission.task_title}</td>
                                            <td>{submission.buyerName}</td>
                                            <td>
                                                <span className="badge badge-success gap-2">
                                                    <DollarSign size={14} />
                                                    {submission.payable_amount} coins
                                                </span>
                                            </td>
                                            <td>{getStatusBadge(submission.status)}</td>
                                            <td className="text-sm text-base-content/60">
                                                {new Date(submission.current_date).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="max-w-xs truncate" title={submission.submission_details}>
                                                    {submission.submission_details}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-base-content/60">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} submissions
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        className="btn btn-sm btn-outline"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setPage(index + 1)}
                                                className={`btn btn-sm ${page === index + 1 ? 'btn-primary' : 'btn-outline'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={page === totalPages}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default MySubmissions
