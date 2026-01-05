import React from 'react'
import { useNavigate } from 'react-router'
import { XCircle } from 'lucide-react'

const PaymentCancel = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center">
                        <XCircle className="text-error" size={64} />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-2 text-error">Payment Cancelled</h1>
                <p className="text-base-content/60 mb-8">
                    Your payment was cancelled. No charges were made to your account.
                </p>
            </div>

            <div className="bg-base-200 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">What would you like to do?</h3>
                <ul className="space-y-2 text-base-content/70 mb-6">
                    <li>• Return to dashboard to manage your tasks</li>
                    <li>• Try purchasing coins again</li>
                    <li>• Contact support if you encountered any issues</li>
                </ul>
            </div>

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
                    Try Again
                </button>
            </div>
        </div>
    )
}

export default PaymentCancel
