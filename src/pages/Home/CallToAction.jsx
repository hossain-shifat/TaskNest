import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main CTA box animation
            gsap.from(ctaRef.current, {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.9,
                opacity: 0,
                y: 60,
                duration: 1,
                ease: 'back.out(1.4)'
            });

            // Heading elements
            gsap.from('.cta-badge', {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: -180,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(2)',
                delay: 0.2
            });

            gsap.from('.cta-title', {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.4
            });

            gsap.from('.cta-subtitle', {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.6
            });

            // Feature cards animation
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 40,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: 0.8 + (i * 0.15)
                });

                // Icon animation
                const icon = card.querySelector('.feature-icon');
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotation: -90,
                    scale: 0,
                    duration: 0.5,
                    ease: 'back.out(2)',
                    delay: 1 + (i * 0.15)
                });

                // Hover animation
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -8,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(icon, {
                        scale: 1.15,
                        rotation: 5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // Buttons animation
            gsap.from('.cta-buttons', {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 1.2
            });

            // Floating animation for decorative elements
            gsap.to('.float-element', {
                y: -20,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.3
            });

            // Pulse animation for sparkle
            gsap.to('.pulse-element', {
                scale: 1.2,
                opacity: 0.7,
                duration: 1.5,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: Sparkles,
            title: 'Instant Start',
            description: 'Get coins on signup'
        },
        {
            icon: TrendingUp,
            title: 'Daily Tasks',
            description: 'New opportunities posted'
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Protected transactions'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 bg-base-100 relative overflow-hidden">
            {/* Animated background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="float-element absolute top-20 left-10 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
                <div className="float-element absolute bottom-20 right-10 w-80 h-80 bg-linear-to-br from-secondary/20 to-transparent rounded-full blur-3xl"></div>
                <div className="float-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-full mx-auto relative z-10">
                <div
                    ref={ctaRef}
                    className="bg-linear-to-br from-base-200 to-base-300 rounded-3xl shadow-2xl border border-base-300 overflow-hidden relative"
                >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>

                    {/* Pulse effect element */}
                    <div className="pulse-element absolute top-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
                        {/* Badge */}
                        <div className="cta-badge flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full shadow-lg">
                                <Sparkles className="w-4 h-4 text-accent-content" />
                                <span className="text-accent-content font-bold text-sm uppercase tracking-wider">
                                    Start Earning Today
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="cta-title text-4xl md:text-5xl lg:text-6xl font-bold text-base-content text-center mb-4">
                            Ready to Join{' '}
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                12,000+ Workers
                            </span>
                            ?
                        </h2>

                        {/* Subtitle */}
                        <p className="cta-subtitle text-lg md:text-xl text-base-content/70 text-center max-w-2xl mx-auto mb-10">
                            Create your account in 60 seconds and start completing tasks. No experience required, no upfront costs.
                        </p>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (cardsRef.current[index] = el)}
                                        className="bg-base-100 rounded-xl p-6 border border-base-300 shadow-md cursor-pointer"
                                    >
                                        <div className="feature-icon w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg">
                                            <Icon className="w-6 h-6 text-primary-content" />
                                        </div>
                                        <h3 className="text-lg font-bold text-base-content mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-base-content/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                <span>Join as Worker</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                            <button className="btn btn-secondary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                <span>Post Tasks as Buyer</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-base-content/60">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>Free to join</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>Instant coin bonus</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom note */}
                <div className="text-center mt-8">
                    <p className="text-sm text-base-content/60">
                        Join the platform trusted by thousands. Start your earning journey in minutes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
