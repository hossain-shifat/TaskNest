import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DollarSign, History } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'

const PaymentHistory = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const tableRef = useRef(null)

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payment-history', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    // useEffect(() => {
    //     if (payments.length > 0 && !isLoading) {
    //         gsap.from(tableRef.current, {
    //             y: 30,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [payments, isLoading])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalCoins = payments.reduce((sum, payment) => sum + payment.coin, 0)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Payment History</h1>
                <p className="text-base-content/60">View all your coin purchase transactions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60 mb-1">Total Spent</p>
                            <p className="text-3xl font-bold text-success">${totalSpent.toFixed(2)}</p>
                        </div>
                        <DollarSign className="text-success" size={40} />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-accent/20 to-warning/20 rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60 mb-1">Total Coins Purchased</p>
                            <p className="text-3xl font-bold text-coin">{totalCoins}</p>
                        </div>
                        <History className="text-coin" size={40} />
                    </div>
                </div>
            </div>

            {/* Payment History Table */}
            <div ref={tableRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

                {payments.length === 0 ? (
                    <div className="text-center py-16 text-base-content/60">
                        <History size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No payment history yet</p>
                        <p className="text-sm mt-2">Purchase coins to see your transaction history here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Coins</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="hover">
                                        <td className="font-mono text-sm">{payment.transactionId}</td>
                                        <td>
                                            <span className="badge badge-success gap-2">
                                                <DollarSign size={14} />
                                                {payment.coin} coins
                                            </span>
                                        </td>
                                        <td className="font-semibold">${payment.amount}</td>
                                        <td>
                                            <span className="badge badge-info uppercase">
                                                {payment.currency}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-success capitalize">
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(payment.paidAt).toLocaleString()}
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

export default PaymentHistory
