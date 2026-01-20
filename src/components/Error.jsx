import React, { useEffect, useRef } from 'react';
import { useNavigate, useRouteError } from 'react-router';
import gsap from 'gsap';
import { Home, RefreshCcw, ArrowLeft } from 'lucide-react';

const Error = () => {
    const navigate = useNavigate();
    const error = useRouteError();
    const containerRef = useRef(null);
    const glitchRef = useRef(null);
    const floatingRef = useRef([]);
    const textRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial setup - hide elements
            gsap.set([textRef.current, buttonsRef.current], { opacity: 0, y: 30 });
            gsap.set(floatingRef.current, { opacity: 0, scale: 0 });

            // Create timeline for entrance animations
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Animate 404 number with glitch effect
            tl.from(glitchRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.8,
                ease: 'back.out(1.7)',
            })
                .to(glitchRef.current, {
                    filter: 'drop-shadow(0 0 10px oklch(77% 0.152 181.912))',
                    duration: 0.3,
                    repeat: 2,
                    yoyo: true,
                }, '-=0.3')
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                }, '-=0.4')
                .to(floatingRef.current, {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.5,
                }, '-=0.3')
                .to(buttonsRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                }, '-=0.2');

            // Continuous floating animation for geometric shapes
            floatingRef.current.forEach((el, i) => {
                if (el) {
                    gsap.to(el, {
                        y: '+=20',
                        rotation: '+=360',
                        duration: 3 + i,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: i * 0.2,
                    });
                }
            });

            // Glitch effect loop
            gsap.to(glitchRef.current, {
                x: () => gsap.utils.random(-2, 2),
                duration: 0.1,
                repeat: -1,
                repeatDelay: 3,
                yoyo: true,
            });

            // Pulse effect on 404
            gsap.to(glitchRef.current, {
                scale: 1.02,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

        }, containerRef);

        return () => ctx.revert(); // Cleanup for React StrictMode
    }, []);

    const handleButtonClick = (action) => {
        const ctx = gsap.context(() => {
            gsap.to(containerRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                onComplete: () => {
                    if (action === 'home') navigate('/');
                    else if (action === 'back') navigate(-1);
                    else window.location.reload();
                },
            });
        }, containerRef);
    };

    // Get error details
    const errorMessage = error?.statusText || error?.message || 'Something went wrong';
    const errorStatus = error?.status || 404;

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-base-100 flex items-center justify-center relative overflow-hidden p-4"
        >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (floatingRef.current[i] = el)}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        <div
                            className={`w-16 h-16 ${i % 3 === 0
                                    ? 'bg-primary/10 rounded-full'
                                    : i % 3 === 1
                                        ? 'bg-secondary/10 rounded-lg rotate-45'
                                        : 'bg-accent/10 rounded-full'
                                } backdrop-blur-sm`}
                        />
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Error Number with Accent Gradient */}
                <div
                    ref={glitchRef}
                    className="text-[12rem] md:text-[16rem] font-black leading-none mb-4"
                >
                    <span className="text-coin" style={{
                        background: 'linear-gradient(135deg, oklch(62% 0.24 264) 0%, oklch(77% 0.152 181.912) 50%, oklch(68% 0.20 180) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {errorStatus}
                    </span>
                </div>

                {/* Error text */}
                <div ref={textRef} className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-base-content mb-4">
                        {errorStatus === 404 ? 'Page Not Found' : 'Oops! Something Went Wrong'}
                    </h1>
                    <p className="text-lg md:text-xl text-base-content/70 mb-2">
                        {errorStatus === 404
                            ? "The page you're looking for seems to have wandered off."
                            : errorMessage}
                    </p>
                    <p className="text-base md:text-lg text-base-content/50">
                        Don't worry, even the best explorers get lost sometimes.
                    </p>
                </div>

                {/* Action buttons */}
                <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => handleButtonClick('home')}
                        className="btn btn-primary group relative overflow-hidden w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go Home</span>
                        <div className="absolute inset-0 bg-primary-content/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <button
                        onClick={() => handleButtonClick('back')}
                        className="btn btn-secondary w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => handleButtonClick('reload')}
                        className="btn btn-accent group w-full sm:w-auto"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Reload Page</span>
                    </button>
                </div>

                {/* Additional info with accent color */}
                <div className="mt-12 text-base-content/40 text-sm font-medium">
                    Error Code: <span className="text-coin">{errorStatus}</span> | {errorStatus === 404 ? 'Page Not Found' : 'Error Occurred'}
                </div>
            </div>

            {/* Corner decorations with theme colors */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-accent/20 to-transparent rounded-tl-full" />

            {/* Additional corner accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-secondary/15 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-accent/15 to-transparent rounded-tr-full" />
        </div>
    );
};

export default Error;
