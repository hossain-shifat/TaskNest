import { useState, useEffect, useRef, useContext } from 'react';
import { Camera, Edit2, Save, X, Coins, TrendingUp, Clock, CheckCircle, Users, DollarSign } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthContext } from '../../context/Auth/AuthCOntext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

gsap.registerPlugin(ScrollTrigger);

/**
 * Profile Component
 * Modern social media-style profile page with role-based sections
 * Features editable profile, GSAP animations, imgBB upload, and responsive design
 */

const Profile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // State management
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        displayName: '',
        bio: '',
        photoURL: '',
        bannerURL: ''
    });

    // Refs for animations
    const bannerRef = useRef(null);
    const profileCardRef = useRef(null);
    const statsRef = useRef(null);
    const aboutRef = useRef(null);
    const activityRef = useRef(null);

    // imgBB Upload Function
    const uploadToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_HOST}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                return data.data.display_url;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading to imgBB:', error);
            throw error;
        }
    };

    // Handle Profile Photo Upload
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingPhoto(true);
        try {
            const imageUrl = await uploadToImgBB(file);
            setEditForm({ ...editForm, photoURL: imageUrl });

            // Show success feedback
            gsap.to(profileCardRef.current, {
                scale: 1.02,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        } catch (error) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Handle Banner Upload
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingBanner(true);
        try {
            const imageUrl = await uploadToImgBB(file);
            setEditForm({ ...editForm, bannerURL: imageUrl });

            // Show success feedback
            gsap.to(bannerRef.current, {
                scale: 1.01,
                opacity:100,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        } catch (error) {
            alert('Failed to upload banner. Please try again.');
        } finally {
            setUploadingBanner(false);
        }
    };

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                // Fetch user profile
                const userResponse = await axiosSecure.get(`/users/${user.email}`);
                setUserData(userResponse.data);

                // Set edit form with current data
                setEditForm({
                    displayName: userResponse.data.displayName || '',
                    bio: userResponse.data.bio || '',
                    photoURL: userResponse.data.photoURL || '',
                    bannerURL: userResponse.data.bannerURL || ''
                });

                // Fetch role-specific stats
                await fetchRoleStats(userResponse.data.role, user.email);

                // Fetch recent activity
                await fetchRecentActivity(userResponse.data.role, user.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, axiosSecure]);

    // Fetch role-specific statistics
    const fetchRoleStats = async (role, email) => {
        try {
            if (role === 'worker') {
                const response = await axiosSecure.get(`/submissions/stats/worker?email=${email}`);
                setStats(response.data);
            } else if (role === 'buyer') {
                const response = await axiosSecure.get(`/tasks/stats/buyer?email=${email}`);
                setStats(response.data);
            } else if (role === 'admin') {
                const response = await axiosSecure.get('/users/stats/admin');
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch recent activity based on role
    const fetchRecentActivity = async (role, email) => {
        try {
            if (role === 'worker') {
                const response = await axiosSecure.get(`/submissions?workerEmail=${email}`);
                setRecentActivity(response.data.slice(0, 5));
            } else if (role === 'buyer') {
                const response = await axiosSecure.get(`/tasks?buyerEmail=${email}`);
                setRecentActivity(response.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        }
    };

    // GSAP Animations
    useEffect(() => {
        if (loading || !userData) return;

        // Banner entrance animation
        gsap.from(bannerRef.current, {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Profile card animation
        gsap.from(profileCardRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 30,
            duration: 0.8,
            delay: 0.2,
            ease: 'back.out(1.7)'
        });

        // Stats cards stagger animation
        gsap.from('.stat-card', {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // About section animation
        gsap.from(aboutRef.current, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            scrollTrigger: {
                trigger: aboutRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Activity section animation
        if (activityRef.current) {
            gsap.from('.activity-item', {
                opacity: 0,
                x: 30,
                stagger: 0.1,
                duration: 0.5,
                scrollTrigger: {
                    trigger: activityRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [loading, userData]);

    // Handle profile update
    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            await axiosSecure.patch(`/users/${userData._id}/profile`, editForm);

            // Update local state
            setUserData({ ...userData, ...editForm });
            setIsEditMode(false);

            // Success animation
            gsap.to(profileCardRef.current, {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditForm({
            displayName: userData.displayName || '',
            bio: userData.bio || '',
            photoURL: userData.photoURL || '',
            bannerURL: userData.bannerURL || ''
        });
        setIsEditMode(false);
    };

    // Get role-specific stats display
    const getRoleStatsCards = () => {
        if (!stats) return null;

        const role = userData?.role;

        if (role === 'worker') {
            return (
                <>
                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Coins</p>
                                    <p className="text-3xl font-bold text-coin mt-1">{userData.coin || 0}</p>
                                </div>
                                <div className="bg-accent/10 p-3 rounded-full">
                                    <Coins className="w-8 h-8 text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Submissions</p>
                                    <p className="text-3xl font-bold text-info mt-1">{stats.totalSubmission || 0}</p>
                                </div>
                                <div className="bg-info/10 p-3 rounded-full">
                                    <TrendingUp className="w-8 h-8 text-info" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Pending</p>
                                    <p className="text-3xl font-bold text-warning mt-1">{stats.pendingSubmission || 0}</p>
                                </div>
                                <div className="bg-warning/10 p-3 rounded-full">
                                    <Clock className="w-8 h-8 text-warning" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Earnings</p>
                                    <p className="text-3xl font-bold text-success mt-1">{stats.totalEarning || 0}</p>
                                </div>
                                <div className="bg-success/10 p-3 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-success" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (role === 'buyer') {
            return (
                <>
                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Coins</p>
                                    <p className="text-3xl font-bold text-coin mt-1">{userData.coin || 0}</p>
                                </div>
                                <div className="bg-accent/10 p-3 rounded-full">
                                    <Coins className="w-8 h-8 text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Tasks</p>
                                    <p className="text-3xl font-bold text-primary mt-1">{stats.taskCount || 0}</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <TrendingUp className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Pending Tasks</p>
                                    <p className="text-3xl font-bold text-warning mt-1">{stats.pendingTask || 0}</p>
                                </div>
                                <div className="bg-warning/10 p-3 rounded-full">
                                    <Clock className="w-8 h-8 text-warning" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Payments</p>
                                    <p className="text-3xl font-bold text-success mt-1">${stats.totalPayment || 0}</p>
                                </div>
                                <div className="bg-success/10 p-3 rounded-full">
                                    <DollarSign className="w-8 h-8 text-success" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (role === 'admin') {
            return (
                <>
                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Workers</p>
                                    <p className="text-3xl font-bold text-secondary mt-1">{stats.workerCount || 0}</p>
                                </div>
                                <div className="bg-secondary/10 p-3 rounded-full">
                                    <Users className="w-8 h-8 text-secondary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Buyers</p>
                                    <p className="text-3xl font-bold text-primary mt-1">{stats.buyerCount || 0}</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Platform Coins</p>
                                    <p className="text-3xl font-bold text-accent mt-1">{stats.totalCoin || 0}</p>
                                </div>
                                <div className="bg-accent/10 p-3 rounded-full">
                                    <Coins className="w-8 h-8 text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">Total Payments</p>
                                    <p className="text-3xl font-bold text-success mt-1">${stats.totalPayments || 0}</p>
                                </div>
                                <div className="bg-success/10 p-3 rounded-full">
                                    <DollarSign className="w-8 h-8 text-success" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 pb-20">
            {/* Banner Section */}
            <div ref={bannerRef} className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                <img
                    src={editForm.bannerURL || userData?.bannerURL || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'}
                    alt="Profile Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-200/50"></div>

                {isEditMode && (
                    <div className="absolute top-4 right-4">
                        <label className={`btn btn-sm btn-circle btn-primary ${uploadingBanner ? 'loading' : ''}`}>
                            {!uploadingBanner && <Camera className="w-4 h-4" />}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                disabled={uploadingBanner}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={profileCardRef} className="relative -mt-16 md:-mt-20">
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                {/* Profile Picture */}
                                <div className="relative flex-shrink-0">
                                    <div className="avatar">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={editForm.photoURL || userData?.photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
                                        </div>
                                    </div>
                                    {isEditMode && (
                                        <label className={`absolute bottom-0 right-0 btn btn-sm btn-circle btn-primary ${uploadingPhoto ? 'loading' : ''}`}>
                                            {!uploadingPhoto && <Camera className="w-4 h-4" />}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                disabled={uploadingPhoto}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            className="input input-bordered w-full max-w-md mb-2"
                                            value={editForm.displayName}
                                            onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                            placeholder="Your Name"
                                        />
                                    ) : (
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData?.displayName}</h1>
                                    )}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`badge ${userData?.role === 'admin' ? 'badge-admin' :
                                            userData?.role === 'buyer' ? 'badge-buyer' :
                                                'badge-worker'
                                            } badge-lg`}>
                                            {userData?.role?.toUpperCase()}
                                        </span>
                                        <span className="text-base-content/60">{userData?.email}</span>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <div className="flex gap-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="btn btn-primary btn-sm gap-2"
                                                disabled={saving || uploadingPhoto || uploadingBanner}
                                            >
                                                {saving ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="btn btn-ghost btn-sm gap-2"
                                                disabled={saving || uploadingPhoto || uploadingBanner}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="btn btn-outline btn-sm gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div ref={statsRef} className="mt-8">
                    <h2 className="text-2xl font-bold mb-6">Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getRoleStatsCards()}
                    </div>
                </div>

                {/* About Section */}
                <div ref={aboutRef} className="mt-8">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">About</h2>
                            {isEditMode ? (
                                <textarea
                                    className="textarea textarea-bordered w-full h-32"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-base-content/80 leading-relaxed">
                                    {userData?.bio || 'No bio added yet. Click Edit Profile to add one.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                {recentActivity.length > 0 && (
                    <div ref={activityRef} className="mt-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="activity-item flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {activity.task_title || activity.title}
                                                </h3>
                                                <p className="text-sm text-base-content/60">
                                                    {userData?.role === 'worker' && activity.status && (
                                                        <span className={`status-${activity.status}`}>
                                                            Status: {activity.status}
                                                        </span>
                                                    )}
                                                    {userData?.role === 'buyer' && (
                                                        <span>Workers needed: {activity.required_workers}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {activity.payable_amount && (
                                                    <p className="text-coin font-bold">{activity.payable_amount} coins</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
