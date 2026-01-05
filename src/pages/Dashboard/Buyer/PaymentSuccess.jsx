import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, DollarSign } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const [paymentData, setPaymentData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const sessionId = searchParams.get('session_id')

        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentData(res.data)
                    queryClient.invalidateQueries(['user-data'])
                    queryClient.invalidateQueries(['buyer-stats'])
                })
                .catch(err => {
                    console.error('Payment verification error:', err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [searchParams])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle className="text-success" size={64} />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-2 text-success">Payment Successful!</h1>
                <p className="text-base-content/60">
                    Your coins have been added to your account
                </p>
            </div>

            {paymentData && (
                <div className="bg-base-200 rounded-lg p-6 shadow-md space-y-4">
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>

                    <div className="flex justify-between items-center py-3 border-b border-base-300">
                        <span className="text-base-content/60">Transaction ID</span>
                        <span className="font-mono text-sm">{paymentData.transactionId}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-base-300">
                        <span className="text-base-content/60">Coins Purchased</span>
                        <span className="badge badge-success gap-2 py-3 px-4">
                            <DollarSign size={16} />
                            {paymentData.coin} coins
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-base-300">
                        <span className="text-base-content/60">Amount Paid</span>
                        <span className="font-semibold text-lg">${paymentData.amount}</span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                        <span className="text-base-content/60">Date</span>
                        <span>{new Date(paymentData.paidAt).toLocaleString()}</span>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-primary flex-1"
                >
                    Go to Dashboard
                </button>
                <button
                    onClick={() => navigate('/dashboard/purchase-coin')}
                    className="btn btn-outline flex-1"
                >
                    Buy More Coins
                </button>
            </div>
        </div>
    )
}

export default PaymentSuccess
