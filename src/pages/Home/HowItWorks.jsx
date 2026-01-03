import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, CheckSquare, Coins, Wallet } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const steps = stepsRef.current;

            // Animate heading
            gsap.from('.how-heading', {
                scrollTrigger: {
                    trigger: '.how-heading',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

            // Stagger steps from alternating directions
            steps.forEach((step, index) => {
                const isEven = index % 2 === 0;

                gsap.from(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    x: isEven ? -100 : 100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: index * 0.15
                });

                // Icon rotation animation
                gsap.from(step.querySelector('.step-icon'), {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotation: 180,
                    scale: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    delay: index * 0.15 + 0.2
                });
            });

            // Animate connector lines
            gsap.from('.connector-line', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.2,
                ease: 'power2.inOut',
                stagger: 0.2
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const steps = [
        {
            icon: UserPlus,
            title: 'Create Your Account',
            description: 'Register as a Worker or Buyer. Workers receive 10 coins, Buyers get 50 coins to start your journey.',
            color: 'primary'
        },
        {
            icon: CheckSquare,
            title: 'Browse & Complete Tasks',
            description: 'Explore available micro-tasks. Submit your work with required proof and wait for buyer approval.',
            color: 'secondary'
        },
        {
            icon: Coins,
            title: 'Earn Coins Instantly',
            description: 'Get coins credited immediately upon task approval. Track your earnings in real-time from your dashboard.',
            color: 'accent'
        },
        {
            icon: Wallet,
            title: 'Withdraw Your Money',
            description: 'Convert 20 coins to $1 and withdraw when you reach 200 coins minimum. Multiple payment options available.',
            color: 'success'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 px-4 bg-base-200 overflow-x-hidden rounded-2xl mt-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 how-heading">
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Start earning in four simple steps. Join thousands of workers completing tasks and building income.
                    </p>
                </div>

                <div className="relative">
                    {/* Desktop connector lines */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 px-8">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="connector-line absolute h-0.5 bg-linear-to-r from-primary/30 to-secondary/30"
                                style={{
                                    left: `${(i * 33.33) + 8.33}%`,
                                    width: '25%'
                                }}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    ref={(el) => (stepsRef.current[index] = el)}
                                    className="relative"
                                >
                                    <div className="bg-base-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-base-300">
                                        {/* Step number */}
                                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-bold shadow-lg">
                                            {index + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className={`step-icon w-16 h-16 mx-auto mb-4 rounded-full bg-${step.color}/10 flex items-center justify-center`}>
                                            <Icon className={`w-8 h-8 text-${step.color}`} />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-base-content mb-3 text-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-base-content/70 text-center text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Get Started Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
