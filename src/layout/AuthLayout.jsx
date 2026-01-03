import { Outlet } from 'react-router';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * AuthLayout - Dedicated layout for authentication pages
 * Features:
 * - Centered card-based design
 * - Minimal header (no full navbar)
 * - Gradient background with subtle pattern
 * - GSAP-powered page transitions
 * - Fully responsive across all devices
 */
const AuthLayout = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        // Entrance animation for auth card
        const ctx = gsap.context(() => {
            gsap.from(backgroundRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        >
            {/* Animated gradient background */}
            <div
                ref={backgroundRef}
                className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10"
            >
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Floating orbs for visual interest */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Auth card container */}
            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-md"
            >
                <div className="card bg-base-100 shadow-2xl backdrop-blur-sm border border-base-300">
                    <div className="card-body p-8">
                        <Outlet />
                    </div>
                </div>

                {/* Minimal branding */}
                <div className="text-center mt-6 text-sm text-base-content/60">
                    <p>Micro Task Platform © 2026</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout
