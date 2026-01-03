import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { AuthContext } from '../../../context/Auth/AuthCOntext';
/**
 * Register Component
 * Handles new user registration with email/password
 * Creates Firestore user document with role-based coin allocation
 * Features GSAP animations and comprehensive validation
 */
const Register = () => {
    const { registerUser, updateUserProfile, singInGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const formRef = useRef(null);
    const errorRef = useRef(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
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

    const onSubmit = async (data) => {
        setLoading(true);
        setAuthError('');

        try {
            // 1. Register user with Firebase Auth
            const userCredential = await registerUser(data.email, data.password);
            const user = userCredential.user;

            // 2. Update user profile with name and photo
            await updateUserProfile(data.name, data.photoURL || '');

            // 4. Store access token in localStorage
            const token = await user.getIdToken();
            localStorage.setItem('access-token', token);

            // 5. Success animation before redirect
            await gsap.to(formRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            });

            // 6. Redirect to dashboard
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

    const handleGoogleRegister = async () => {
        setLoading(true);
        setAuthError('');

        try {
            const result = await singInGoogle();
            const user = result.user;

            const token = await user.getIdToken();
            localStorage.setItem('access-token', token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google registration error:', error);
            setAuthError('Google sign-in failed. Please try again.');
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

            <div onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                {/* Profile Picture URL */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Profile Picture URL (Optional)</span>
                    </label>
                    <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        className={`input input-bordered w-full ${errors.photoURL ? 'input-error' : ''}`}
                        {...register('photoURL', {
                            pattern: {
                                value: /^https?:\/\/.+/i,
                                message: 'Must be a valid URL'
                            }
                        })}
                    />
                    {errors.photoURL && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.photoURL.message}</span>
                        </label>
                    )}
                </div>

                {/* Password */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />

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

                {/* Submit Button */}
                <div className="submit-btn">
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="btn btn-primary w-full"
                        disabled={loading}
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
            </div>

            {/* Divider */}
            <div className="divider my-6">OR</div>

            {/* Google Sign-In */}
            <button
                onClick={handleGoogleRegister}
                className="btn btn-outline w-full"
                disabled={loading}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>

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
