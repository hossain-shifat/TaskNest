import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DollarSign, Wallet } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const Withdrawals = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const [withdrawCoin, setWithdrawCoin] = useState('')
    const [paymentSystem, setPaymentSystem] = useState('stripe')
    const [accountNumber, setAccountNumber] = useState('')
    const contentRef = useRef(null)

    const { data: userData } = useQuery({
        queryKey: ['user-data', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const { data: withdrawals = [] } = useQuery({
        queryKey: ['my-withdrawals', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/withdrawals?workerEmail=${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    // useEffect(() => {
    //     if (userData) {
    //         gsap.from(contentRef.current, {
    //             y: 50,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [userData])

    const currentCoin = userData?.coin || 0
    const withdrawalAmount = withdrawCoin ? (parseInt(withdrawCoin) / 20).toFixed(2) : '0.00'
    const canWithdraw = currentCoin >= 200

    const handleSubmit = async (e) => {
        e.preventDefault()

        const coin = parseInt(withdrawCoin)

        if (coin > currentCoin) {
            Swal.fire('Error!', 'You don\'t have enough coins.', 'error')
            return
        }

        if (coin < 200) {
            Swal.fire('Error!', 'Minimum withdrawal is 200 coins.', 'error')
            return
        }

        try {
            const withdrawal = {
                workerEmail: user.email,
                workerName: user.displayName,
                withdrawal_coin: coin,
                withdrawal_amount: parseFloat(withdrawalAmount),
                payment_system: paymentSystem,
                account_number: accountNumber
            }

            await axiosSecure.post('/withdrawals', withdrawal)

            Swal.fire('Success!', 'Withdrawal request submitted successfully.', 'success')

            setWithdrawCoin('')
            setAccountNumber('')
            queryClient.invalidateQueries(['my-withdrawals'])
            queryClient.invalidateQueries(['user-data'])
        } catch (error) {
            Swal.fire('Error!', 'Failed to submit withdrawal request.', 'error')
        }
    }

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'badge-warning',
            approved: 'badge-success'
        }
        return (
            <span className={`badge ${statusClasses[status]} font-semibold`}>
                {status}
            </span>
        )
    }

    return (
        <div ref={contentRef} className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Withdrawals</h1>
                <p className="text-base-content/60">Request withdrawals and track your earnings</p>
            </div>

            {/* Earnings Card */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 shadow-lg border border-primary/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-base-content/60 mb-1">Your Current Coins</p>
                        <p className="text-4xl font-bold text-primary">{currentCoin} coins</p>
                    </div>
                    <Wallet className="text-primary" size={48} />
                </div>
                <div className="mt-4 pt-4 border-t border-base-300">
                    <p className="text-sm text-base-content/60 mb-1">Withdrawal Amount</p>
                    <p className="text-2xl font-bold text-success">${(currentCoin / 20).toFixed(2)}</p>
                    <p className="text-xs text-base-content/60 mt-1">20 coins = $1</p>
                </div>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-base-200 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Request Withdrawal</h2>

                {!canWithdraw ? (
                    <div className="alert alert-warning">
                        <span>You need at least 200 coins (equivalent to $10) to make a withdrawal.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Coins to Withdraw</span>
                            </label>
                            <input
                                type="number"
                                value={withdrawCoin}
                                onChange={(e) => setWithdrawCoin(e.target.value)}
                                min="200"
                                max={currentCoin}
                                step="20"
                                className="input input-bordered w-full"
                                placeholder="Enter coins (minimum 200)"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Withdrawal Amount</span>
                            </label>
                            <div className="input input-bordered w-full flex items-center gap-2 bg-base-300">
                                <DollarSign size={20} />
                                <span className="font-semibold text-lg">{withdrawalAmount}</span>
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Payment System</span>
                            </label>
                            <select
                                value={paymentSystem}
                                onChange={(e) => setPaymentSystem(e.target.value)}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="stripe">Stripe</option>
                                <option value="bkash">Bkash</option>
                                <option value="rocket">Rocket</option>
                                <option value="nagad">Nagad</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Account Number</span>
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter your account number"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Submit Withdrawal Request
                        </button>
                    </form>
                )}
            </div>

            {/* Withdrawal History */}
            <div className="bg-base-200 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>

                {withdrawals.length === 0 ? (
                    <div className="text-center py-8 text-base-content/60">
                        <Wallet size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No withdrawal history yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Coins</th>
                                    <th>Amount</th>
                                    <th>Payment System</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.map((withdrawal) => (
                                    <tr key={withdrawal._id} className="hover">
                                        <td className="text-sm text-base-content/60">
                                            {new Date(withdrawal.withdraw_date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="badge badge-warning">
                                                {withdrawal.withdrawal_coin} coins
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-success gap-2">
                                                <DollarSign size={14} />
                                                ${withdrawal.withdrawal_amount}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-info">
                                                {withdrawal.payment_system}
                                            </span>
                                        </td>
                                        <td>{getStatusBadge(withdrawal.status)}</td>
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

export default Withdrawals
