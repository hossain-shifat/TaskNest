import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../../context/Auth/AuthCOntext';
import SocialLogin from '../../../components/SocialLogin';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


/**
 * Register Component
 * Handles new user registration with email/password
 * Creates Firebase user with updated profile and MongoDB user document
 * Features GSAP animations and comprehensive validation
 */
const Register = () => {
    const { registerUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const axiosSecure = useAxiosSecure();

    const formRef = useRef(null);
    const errorRef = useRef(null);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        mode: 'onBlur'
    });

    // Watch password for strength indicator
    const password = watch('password', '');

    useEffect(() => {
        // Staggered form field entrance animation
        const ctx = gsap.context(() => {
            gsap.from('.form-field', {
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });

            gsap.from('.submit-btn', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                delay: 0.8,
                ease: 'power2.out'
            });
        }, formRef);

        return () => ctx.revert();
    }, []);

    // Animate error messages
    useEffect(() => {
        if (authError && errorRef.current) {
            gsap.fromTo(errorRef.current,
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [authError]);

    // Password strength calculator
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, label: '', color: '' };
        if (pwd.length < 6) return { strength: 25, label: 'Weak', color: 'error' };
        if (pwd.length < 8) return { strength: 50, label: 'Fair', color: 'warning' };
        if (pwd.length < 12) return { strength: 75, label: 'Good', color: 'info' };
        return { strength: 100, label: 'Strong', color: 'success' };
    };

    const passwordStrength = getPasswordStrength(password);

    // Handle image upload to imgBB
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setAuthError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setAuthError('Image size must be less than 5MB');
            return;
        }

        setUploadingImage(true);
        setAuthError('');

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to imgBB
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_HOST}`,
                formData
            );

            if (response.data.success) {
                const imageUrl = response.data.data.display_url;
                setUploadedImageUrl(imageUrl);
                setValue('photoURL', imageUrl);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setAuthError('Failed to upload image. Please try again.');
            setImagePreview(null);
        } finally {
            setUploadingImage(false);
        }
    };

    // Remove uploaded image
    const handleRemoveImage = () => {
        setImagePreview(null);
        setUploadedImageUrl('');
        setValue('photoURL', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data) => {
        // Validate image is uploaded
        if (!uploadedImageUrl) {
            setAuthError('Please upload a profile picture');
            return;
        }

        setLoading(true);
        setAuthError('');

        try {
            // 1. Register user with Firebase Auth
            const userCredential = await registerUser(data.email, data.password);
            const user = userCredential.user;

            // 2. Update Firebase user profile with name and photo BEFORE backend call
            await updateUserProfile({
                displayName: data.name,
                photoURL: uploadedImageUrl
            });

            // 3. Get fresh token after profile update
            const token = await user.getIdToken(true); // Force refresh token

            // 4. Store token in localStorage
            localStorage.setItem('access-token', token);

            // 5. Store user in MongoDB with all profile data
            await axiosSecure.post('/users', {
                email: data.email,
                displayName: data.name,
                role: data.role,
                photoURL: uploadedImageUrl
            });

            // 6. Success animation before redirect
            await gsap.to(formRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            });

            // 7. Redirect to dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                setAuthError('This email is already registered. Please login instead.');
            } else if (error.code === 'auth/invalid-email') {
                setAuthError('Invalid email format. Please check and try again.');
            } else if (error.code === 'auth/weak-password') {
                setAuthError('Password is too weak. Please use at least 6 characters.');
            } else {
                setAuthError(error.message || 'Registration failed. Please try again.');
            }

            // Shake animation on error
            gsap.fromTo(formRef.current,
                { x: -10 },
                { x: 0, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={formRef}>
            <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
            <p className="text-center text-base-content/60 mb-6">
                Join our platform and start earning today
            </p>

            {/* Error Alert */}
            {authError && (
                <div ref={errorRef} className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{authError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Full Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        {...register('name', {
                            required: 'Full name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                    />
                    {errors.name && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.name.message}</span>
                        </label>
                    )}
                </div>

                {/* Email */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Email Address</span>
                    </label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    {errors.email && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.email.message}</span>
                        </label>
                    )}
                </div>

                {/* Password with Toggle */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-base-content/60">Password Strength:</span>
                                <span className={`text-xs font-medium text-${passwordStrength.color}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <progress
                                className={`progress progress-${passwordStrength.color} w-full h-1`}
                                value={passwordStrength.strength}
                                max="100"
                            />
                        </div>
                    )}

                    {errors.password && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.password.message}</span>
                        </label>
                    )}
                </div>

                {/* Role Selection */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Select Your Role</span>
                    </label>
                    <select
                        className={`select select-bordered w-full ${errors.role ? 'select-error' : ''}`}
                        {...register('role', { required: 'Please select a role' })}
                        defaultValue=""
                    >
                        <option value="" disabled>Choose role...</option>
                        <option value="worker">Worker (Earn by completing tasks)</option>
                        <option value="buyer">Buyer (Create and manage tasks)</option>
                    </select>
                    {errors.role && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.role.message}</span>
                        </label>
                    )}

                    {/* Role Info */}
                    <label className="label">
                        <span className="label-text-alt text-info">
                            Workers get 10 coins • Buyers get 50 coins
                        </span>
                    </label>
                </div>

                {/* Profile Picture Upload */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Profile Picture *</span>
                    </label>

                    {!imagePreview ? (
                        <div className="relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-upload"
                            />
                            <label
                                htmlFor="profile-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-base-200"
                            >
                                <Upload className="w-8 h-8 text-base-content/40 mb-2" />
                                <span className="text-sm text-base-content/60">
                                    {uploadingImage ? 'Uploading...' : 'Click to upload profile picture'}
                                </span>
                                <span className="text-xs text-base-content/40 mt-1">
                                    PNG, JPG up to 5MB
                                </span>
                            </label>
                        </div>
                    ) : (
                        <div className="relative w-full h-32 border-2 border-base-300 rounded-lg overflow-hidden">
                            <img
                                src={imagePreview}
                                alt="Preview"
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

                    {/* Hidden input for form validation */}
                    <input
                        type="hidden"
                        {...register('photoURL', {
                            required: 'Profile picture is required'
                        })}
                    />
                    {errors.photoURL && !uploadedImageUrl && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.photoURL.message}</span>
                        </label>
                    )}
                </div>

                {/* Submit Button */}
                <div className="submit-btn">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading || uploadingImage}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="divider my-6">OR</div>

            {/* Google Sign-In Component */}
            <SocialLogin />

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-base-content/60">
                Already have an account?{' '}
                <Link to="/login" className="link link-primary font-medium">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default Register;
