import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { User, Bell, Shield, Palette, Globe, Mail, Lock, Eye, EyeOff, Save, RefreshCw } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useAxiosSecure from '../hooks/UseAxiosSecure'
import { useTheme } from '../hooks/useTheme'
import Swal from 'sweetalert2'

const Settings = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('profile')
    const [showPassword, setShowPassword] = useState(false)

    // Fetch user data
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user-settings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    // Profile update mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            const { data } = await axiosSecure.patch(`/users/${userData._id}/profile`, profileData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user-settings'])
            queryClient.invalidateQueries(['user-data'])
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Your profile has been updated successfully',
                confirmButtonColor: '#3085d6'
            })
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update profile',
                confirmButtonColor: '#d33'
            })
        }
    })

    const [profileForm, setProfileForm] = useState({
        displayName: '',
        bio: '',
        photoURL: '',
        bannerURL: ''
    })

    React.useEffect(() => {
        if (userData) {
            setProfileForm({
                displayName: userData.displayName || '',
                bio: userData.bio || '',
                photoURL: userData.photoURL || '',
                bannerURL: userData.bannerURL || ''
            })
        }
    }, [userData])

    const handleProfileUpdate = () => {
        updateProfileMutation.mutate(profileForm)
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Globe }
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-base-content/60">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-base-100 rounded-xl p-2 shadow-sm border border-base-300">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                                ? 'bg-primary text-primary-content shadow-md'
                                                : 'text-base-content hover:bg-base-200'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Profile Information</h2>
                                    <p className="text-sm text-base-content/60">Update your profile details and photo</p>
                                </div>

                                {/* Profile Photo */}
                                <div className="flex items-center gap-6 p-6 bg-base-200 rounded-lg">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-100">
                                            <img src={profileForm.photoURL || user?.photoURL} alt="Profile" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-2">Profile Photo</h3>
                                        <div className="w-full">
                                            <input
                                                type="url"
                                                value={profileForm.photoURL}
                                                onChange={(e) => setProfileForm({ ...profileForm, photoURL: e.target.value })}
                                                placeholder="Enter image URL"
                                                className="input input-bordered w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Banner Image */}
                                <div className="space-y-3">
                                    <label className="label">
                                        <span className="label-text font-semibold">Profile Banner</span>
                                    </label>
                                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                                        {profileForm.bannerURL ? (
                                            <img src={profileForm.bannerURL} alt="Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-base-content/40">
                                                No banner image
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={profileForm.bannerURL}
                                        onChange={(e) => setProfileForm({ ...profileForm, bannerURL: e.target.value })}
                                        placeholder="Enter banner image URL"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                {/* Display Name */}
                                <div className="space-y-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Display Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.displayName}
                                        onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                                        className="input input-bordered w-full"
                                        placeholder="Your display name"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Bio</span>
                                    </label>
                                    <textarea
                                        value={profileForm.bio}
                                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        className="textarea textarea-bordered w-full h-24"
                                        placeholder="Tell us about yourself..."
                                    ></textarea>
                                    <label className="label">
                                        <span className="label-text-alt text-base-content/60">
                                            {profileForm.bio?.length || 0}/200 characters
                                        </span>
                                    </label>
                                </div>

                                {/* Email (Read-only) */}
                                <div className="space-y-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Email Address</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={user?.email}
                                            readOnly
                                            className="input input-bordered w-full bg-base-200"
                                        />
                                        <div className="badge badge-success gap-2 px-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Verified
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setProfileForm({
                                            displayName: userData.displayName || '',
                                            bio: userData.bio || '',
                                            photoURL: userData.photoURL || '',
                                            bannerURL: userData.bannerURL || ''
                                        })}
                                        className="btn btn-ghost"
                                    >
                                        <RefreshCw size={16} />
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        disabled={updateProfileMutation.isPending}
                                        className="btn btn-primary"
                                    >
                                        {updateProfileMutation.isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Appearance</h2>
                                    <p className="text-sm text-base-content/60">Customize how TaskNest looks</p>
                                </div>

                                {/* Theme Selector */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Theme</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={theme === 'dark' ? toggleTheme : undefined}
                                            className={`p-6 rounded-lg border-2 transition-all ${theme === 'light'
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-base-300 hover:border-base-content/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-base-100 flex items-center justify-center">
                                                    <Eye size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold">Light Mode</p>
                                                    <p className="text-xs text-base-content/60">Bright and clean</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={theme === 'light' ? toggleTheme : undefined}
                                            className={`p-6 rounded-lg border-2 transition-all ${theme === 'dark'
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-base-300 hover:border-base-content/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-base-content flex items-center justify-center">
                                                    <EyeOff size={24} className="text-base-100" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold">Dark Mode</p>
                                                    <p className="text-xs text-base-content/60">Easy on the eyes</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Display Options */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Display Options</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Compact Mode</p>
                                                <p className="text-sm text-base-content/60">Reduce spacing between elements</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Show Animations</p>
                                                <p className="text-sm text-base-content/60">Enable interface animations</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Notifications</h2>
                                    <p className="text-sm text-base-content/60">Manage how you receive notifications</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Email Notifications</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Task Updates</p>
                                                <p className="text-sm text-base-content/60">Get notified when tasks are approved/rejected</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">New Tasks Available</p>
                                                <p className="text-sm text-base-content/60">Notify me when new tasks match my interests</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Payment Confirmations</p>
                                                <p className="text-sm text-base-content/60">Get notified about payments and withdrawals</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Weekly Summary</p>
                                                <p className="text-sm text-base-content/60">Receive a weekly summary of your activity</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Push Notifications</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Browser Notifications</p>
                                                <p className="text-sm text-base-content/60">Show notifications in your browser</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Security</h2>
                                    <p className="text-sm text-base-content/60">Keep your account secure</p>
                                </div>

                                <div className="alert alert-info">
                                    <Shield className="size-5" />
                                    <div>
                                        <p className="font-semibold">Your account is secure</p>
                                        <p className="text-sm">Last login: {new Date().toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Password</h3>
                                    <div className="p-6 bg-base-200 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Change Password</p>
                                                <p className="text-sm text-base-content/60">Last changed 3 months ago</p>
                                            </div>
                                            <button className="btn btn-outline btn-sm">
                                                <Lock size={16} />
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                                    <div className="p-6 bg-base-200 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">2FA Status</p>
                                                <p className="text-sm text-base-content/60">Add an extra layer of security</p>
                                            </div>
                                            <button className="btn btn-primary btn-sm">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Active Sessions</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-base-200 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Current Session</p>
                                                <p className="text-sm text-base-content/60">Chrome on Windows • Active now</p>
                                            </div>
                                            <div className="badge badge-success">Active</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Preferences</h2>
                                    <p className="text-sm text-base-content/60">Customize your experience</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Language & Region</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Language</span>
                                            </label>
                                            <select className="select select-bordered w-full">
                                                <option>English (US)</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium">Timezone</span>
                                            </label>
                                            <select className="select select-bordered w-full">
                                                <option>UTC-5 (Eastern Time)</option>
                                                <option>UTC-8 (Pacific Time)</option>
                                                <option>UTC+0 (GMT)</option>
                                                <option>UTC+6 (Dhaka)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Data & Privacy</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Share Usage Data</p>
                                                <p className="text-sm text-base-content/60">Help improve TaskNest</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-base-200 rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium">Personalized Recommendations</p>
                                                <p className="text-sm text-base-content/60">Get task recommendations based on your activity</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                        </label>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-error">Danger Zone</h3>
                                    <div className="p-6 bg-error/10 border border-error/20 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-error">Delete Account</p>
                                                <p className="text-sm text-base-content/60">Permanently delete your account and all data</p>
                                            </div>
                                            <button className="btn btn-error btn-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
