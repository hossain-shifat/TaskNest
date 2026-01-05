import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, Users } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const tableRef = useRef(null)

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['all-users', searchTerm],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users${searchTerm ? `?search=${searchTerm}` : ''}`)
            return res.data
        }
    })

    // useEffect(() => {
    //     if (users.length > 0 && !isLoading) {
    //         gsap.from(tableRef.current, {
    //             y: 30,
    //             opacity: 0,
    //             duration: 0.6,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [users, isLoading])

    const handleRoleChange = async (userId, newRole) => {
        try {
            const result = await Swal.fire({
                title: 'Change User Role?',
                text: `Are you sure you want to change this user's role to ${newRole}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!'
            })

            if (result.isConfirmed) {
                await axiosSecure.patch(`/users/${userId}/role`, { role: newRole })
                queryClient.invalidateQueries(['all-users'])
                Swal.fire('Updated!', 'User role has been updated.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to update user role.', 'error')
        }
    }

    const handleDelete = async (userId, userName) => {
        try {
            const result = await Swal.fire({
                title: 'Delete User?',
                text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete user!'
            })

            if (result.isConfirmed) {
                await axiosSecure.delete(`/users/${userId}`)
                queryClient.invalidateQueries(['all-users'])
                queryClient.invalidateQueries(['admin-stats'])
                Swal.fire('Deleted!', 'User has been deleted.', 'success')
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete user.', 'error')
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
                <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
                <p className="text-base-content/60">View and manage all platform users</p>
            </div>

            {/* Search Bar */}
            <div className="bg-base-200 rounded-lg p-4 shadow-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="input input-bordered w-full pl-10"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div ref={tableRef} className="bg-base-200 rounded-lg p-6 shadow-md">
                {users.length === 0 ? (
                    <div className="text-center py-16 text-base-content/60">
                        <Users size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Coins</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={user.photoURL}
                                                            alt={user.displayName}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.displayName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                disabled={user.role === 'admin'}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`select select-sm select-bordered ${user.role === 'admin' ? 'badge-admin' :
                                                    user.role === 'buyer' ? 'badge-buyer' : 'badge-worker'
                                                    }`}
                                            >
                                                <option value="worker">Worker</option>
                                                <option value="buyer">Buyer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className="badge badge-success">
                                                {user.coin} coins
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/60">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(user._id, user.displayName)}
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

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Workers</p>
                    <p className="text-2xl font-bold">
                        {users.filter(u => u.role === 'worker').length}
                    </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-base-content/60 mb-1">Buyers</p>
                    <p className="text-2xl font-bold">
                        {users.filter(u => u.role === 'buyer').length}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ManageUsers
