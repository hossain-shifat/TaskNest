import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Users, DollarSign, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PlatformStats = () => {
    const sectionRef = useRef(null);
    const statsRef = useRef([]);
    const numbersRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background animation
            gsap.from('.stats-bg', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.95,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Heading animation
            gsap.from('.stats-heading', {
                scrollTrigger: {
                    trigger: '.stats-heading',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

            // Stats cards animation with stagger
            statsRef.current.forEach((stat, i) => {
                gsap.from(stat, {
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 80,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'back.out(1.4)',
                    delay: i * 0.1
                });

                // Icon pulse animation
                gsap.from(stat.querySelector('.stat-icon'), {
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0,
                    rotation: -180,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    delay: i * 0.1 + 0.3
                });
            });

            // Count-up animation for numbers
            const stats = [
                { target: 45678, duration: 2.5 },
                { target: 12450, duration: 2 },
                { target: 892340, duration: 2.5 },
                { target: 98.5, duration: 2 }
            ];

            stats.forEach((stat, i) => {
                const element = numbersRef.current[i];
                if (!element) return;

                const counter = { value: 0 };
                const isDecimal = stat.target % 1 !== 0;

                gsap.to(counter, {
                    value: stat.target,
                    duration: stat.duration,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    onUpdate: function () {
                        if (isDecimal) {
                            element.textContent = counter.value.toFixed(1);
                        } else {
                            element.textContent = Math.floor(counter.value).toLocaleString();
                        }
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const statistics = [
        {
            icon: CheckCircle2,
            number: 45678,
            suffix: '+',
            label: 'Tasks Completed',
            description: 'Successfully finished and approved',
            color: 'success',
            gradient: 'from-success/20 to-success/5'
        },
        {
            icon: Users,
            number: 12450,
            suffix: '+',
            label: 'Active Workers',
            description: 'Earning daily on our platform',
            color: 'primary',
            gradient: 'from-primary/20 to-primary/5'
        },
        {
            icon: DollarSign,
            number: 892340,
            suffix: '',
            label: 'Coins Distributed',
            description: 'Total earnings to date',
            color: 'accent',
            gradient: 'from-accent/20 to-accent/5'
        },
        {
            icon: TrendingUp,
            number: 98.5,
            suffix: '%',
            label: 'Approval Rate',
            description: 'Tasks approved on first submission',
            color: 'info',
            gradient: 'from-info/20 to-info/5'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 px-4 bg-base-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="stats-bg absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10"></div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 stats-heading">
                    <div className="inline-block px-4 py-2 bg-accent/10 rounded-full mb-4">
                        <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                            Platform Impact
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Real Numbers, Real Success
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Join a thriving community where workers earn and buyers get quality results every single day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statistics.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                ref={(el) => (statsRef.current[index] = el)}
                                className="group"
                            >
                                <div className={`relative bg-gradient-to-br ${stat.gradient} rounded-2xl p-8 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}>
                                    {/* Glow effect on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10`}></div>

                                    {/* Icon */}
                                    <div className="stat-icon mb-6">
                                        <div className={`w-14 h-14 rounded-xl bg-${stat.color}/20 border-2 border-${stat.color}/30 flex items-center justify-center`}>
                                            <Icon className={`w-7 h-7 text-${stat.color}`} />
                                        </div>
                                    </div>

                                    {/* Number */}
                                    <div className="mb-3">
                                        <div className="flex items-baseline gap-1">
                                            <span
                                                ref={(el) => (numbersRef.current[index] = el)}
                                                className={`text-4xl md:text-5xl font-bold text-${stat.color}`}
                                            >
                                                0
                                            </span>
                                            <span className={`text-3xl font-bold text-${stat.color}/70`}>
                                                {stat.suffix}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <h3 className="text-xl font-bold text-base-content mb-2">
                                        {stat.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-base-content/60">
                                        {stat.description}
                                    </p>

                                    {/* Decorative line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}/50 to-transparent rounded-b-2xl`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-base-200 rounded-2xl p-8 shadow-lg border border-base-300">
                        <p className="text-lg text-base-content mb-4">
                            Ready to be part of these growing numbers?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Start as Worker
                            </button>
                            <button className="btn btn-secondary btn-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Post Tasks as Buyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformStats;
