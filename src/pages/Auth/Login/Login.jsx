import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { AuthContext } from '../../../context/Auth/AuthCOntext';

/**
 * Login Component
 * Handles user authentication via email/password or Google
 * Updates last login timestamp in Firestore
 * Features GSAP animations and proper error handling
 */
const Login = () => {
    const { singInUser, singInGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const formRef = useRef(null);
    const errorRef = useRef(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur'
    });

    // Get redirect path from location state (for private routes)
    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        // Staggered form field entrance animation
        const ctx = gsap.context(() => {
            gsap.from('.form-field', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power2.out'
            });

            gsap.from('.submit-btn', {
                scale: 0.9,
                opacity: 0,
                duration: 0.5,
                delay: 0.6,
                ease: 'back.out(1.7)'
            });

            gsap.from('.social-btn', {
                x: -20,
                opacity: 0,
                duration: 0.5,
                delay: 0.8,
                ease: 'power2.out'
            });
        }, formRef);

        return () => ctx.revert();
    }, []);

    // Animate error messages with shake effect
    useEffect(() => {
        if (authError && errorRef.current) {
            gsap.fromTo(errorRef.current,
                { x: -5, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.1,
                    repeat: 3,
                    yoyo: true,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        gsap.to(errorRef.current, { x: 0 });
                    }
                }
            );
        }
    }, [authError]);

    const onSubmit = async (data) => {
        setLoading(true);
        setAuthError('');

        try {
            // 1. Sign in with Firebase Auth
            const userCredential = await singInUser(data.email, data.password);
            const user = userCredential.user;

            // 3. Store access token in localStorage
            const token = await user.getIdToken();
            localStorage.setItem('access-token', token);

            // 4. Success animation before redirect
            await gsap.to(formRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            });

            // 5. Redirect to intended page or dashboard
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Login error:', error);

            // Handle specific Firebase errors
            if (error.code === 'auth/user-not-found') {
                setAuthError('No account found with this email. Please register first.');
            } else if (error.code === 'auth/wrong-password') {
                setAuthError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                setAuthError('Invalid email format. Please check and try again.');
            } else if (error.code === 'auth/invalid-credential') {
                setAuthError('Invalid email or password. Please check your credentials.');
            } else if (error.code === 'auth/too-many-requests') {
                setAuthError('Too many failed attempts. Please try again later.');
            } else {
                setAuthError(error.message || 'Login failed. Please try again.');
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

    const handleGoogleLogin = async () => {
        setLoading(true);
        setAuthError('');

        try {
            const result = await singInGoogle();
            const user = result.user;

            // Store access token
            const token = await user.getIdToken();
            localStorage.setItem('access-token', token);

            // Success animation
            await gsap.to(formRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google login error:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setAuthError('Sign-in cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                setAuthError('Pop-up blocked by browser. Please allow pop-ups and try again.');
            } else {
                setAuthError('Google sign-in failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={formRef}>
            <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-center text-base-content/60 mb-6">
                Sign in to continue to your dashboard
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

            <div className="space-y-4">
                {/* Email */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Email Address</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
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

                {/* Password */}
                <div className="form-field form-control">
                    <label className="label">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />
                    {errors.password && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.password.message}</span>
                        </label>
                    )}
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
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="divider my-6">OR</div>

            {/* Google Sign-In */}
            <button
                onClick={handleGoogleLogin}
                className="social-btn btn btn-outline w-full"
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

            {/* Register Link */}
            <p className="text-center mt-6 text-sm text-base-content/60">
                Don't have an account?{' '}
                <Link to="/register" className="link link-primary font-medium">
                    Create one now
                </Link>
            </p>
        </div>
    );
};

export default Login;
