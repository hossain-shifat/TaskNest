import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Users, TrendingUp, Award, Shield, Zap, Heart, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const statsRef = useRef([]);
    const valuesRef = useRef([]);
    const timelineRef = useRef([]);
    const teamRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero section animation
            const heroTl = gsap.timeline();
            heroTl
                .from('.hero-badge', {
                    scale: 0,
                    rotation: -180,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(2)'
                })
                .from('.hero-title', {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.4')
                .from('.hero-subtitle', {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.5')
                .from('.hero-image', {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.6');

            // Mission section parallax
            gsap.to('.mission-bg', {
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -100,
                ease: 'none'
            });

            gsap.from('.mission-content', {
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from('.mission-visual', {
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Stats counter animation
            statsRef.current.forEach((stat, i) => {
                if (!stat) return;

                gsap.from(stat, {
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    delay: i * 0.1
                });

                // Counter animation
                const counter = stat.querySelector('.stat-number');
                const target = parseInt(counter.getAttribute('data-target'));
                const isDecimal = counter.getAttribute('data-decimal') === 'true';

                const obj = { value: 0 };
                gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    onUpdate: () => {
                        if (isDecimal) {
                            counter.textContent = obj.value.toFixed(1);
                        } else {
                            counter.textContent = Math.floor(obj.value).toLocaleString();
                        }
                    }
                });
            });

            // Values cards 3D flip effect
            valuesRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotationY: 90,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: i * 0.15,
                    transformPerspective: 1000
                });

                // Hover animation
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.value-icon'), {
                        rotation: 360,
                        scale: 1.1,
                        duration: 0.6,
                        ease: 'back.out(2)'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // Timeline items stagger
            timelineRef.current.forEach((item, i) => {
                if (!item) return;

                const isEven = i % 2 === 0;

                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    x: isEven ? -80 : 80,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });

                gsap.from(item.querySelector('.timeline-dot'), {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0,
                    duration: 0.5,
                    ease: 'back.out(3)',
                    delay: 0.3
                });
            });

            // Timeline line draw
            gsap.from('.timeline-line', {
                scrollTrigger: {
                    trigger: '.timeline-section',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                scaleY: 0,
                transformOrigin: 'top center',
                duration: 1.5,
                ease: 'power2.inOut'
            });

            // Team cards animation
            teamRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 60,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.7,
                    ease: 'back.out(1.4)',
                    delay: i * 0.1
                });

                card.addEventListener('mouseenter', () => {
                    gsap.to(card.querySelector('.team-image'), {
                        scale: 1.1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.team-overlay'), {
                        opacity: 1,
                        duration: 0.3
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card.querySelector('.team-image'), {
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.team-overlay'), {
                        opacity: 0,
                        duration: 0.3
                    });
                });
            });

            // Floating elements
            gsap.to('.float-slow', {
                y: -30,
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });

            gsap.to('.float-fast', {
                y: -20,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });

        });

        return () => ctx.revert();
    }, []);

    const stats = [
        { value: 12450, label: 'Active Users', suffix: '+', decimal: false },
        { value: 45678, label: 'Tasks Completed', suffix: '+', decimal: false },
        { value: 98.5, label: 'Success Rate', suffix: '%', decimal: true },
        { value: 24, label: 'Hours Support', suffix: '/7', decimal: false }
    ];

    const values = [
        {
            icon: Target,
            title: 'Mission Driven',
            description: 'Empowering individuals worldwide with flexible earning opportunities and connecting businesses with quality talent.',
            color: 'primary'
        },
        {
            icon: Shield,
            title: 'Trust & Security',
            description: 'Industry-standard encryption, secure payments, and verified users ensure a safe environment for all transactions.',
            color: 'secondary'
        },
        {
            icon: Heart,
            title: 'Community First',
            description: 'Building a supportive ecosystem where workers and buyers thrive together through fair practices and transparency.',
            color: 'accent'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Constantly evolving our platform with cutting-edge features to improve user experience and earning potential.',
            color: 'info'
        }
    ];

    const timeline = [
        {
            year: '2023',
            title: 'Platform Launch',
            description: 'Started with 100 beta users and 500 initial tasks, establishing the foundation of our micro-tasking ecosystem.'
        },
        {
            year: '2024',
            title: 'Rapid Growth',
            description: 'Reached 5,000 active workers and implemented advanced features including real-time notifications and multi-currency support.'
        },
        {
            year: '2025',
            title: 'Global Expansion',
            description: 'Serving 12,000+ users across 15 countries with 45,000+ completed tasks and introducing AI-powered task matching.'
        },
        {
            year: '2026',
            title: 'Future Vision',
            description: 'Scaling to 50,000+ users, launching mobile apps, and expanding payment options for seamless global accessibility.'
        }
    ];

    const team = [
        { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://i.pravatar.cc/300?img=1' },
        { name: 'Michael Chen', role: 'CTO', image: 'https://i.pravatar.cc/300?img=13' },
        { name: 'Emily Rodriguez', role: 'Head of Operations', image: 'https://i.pravatar.cc/300?img=5' },
        { name: 'David Kim', role: 'Lead Developer', image: 'https://i.pravatar.cc/300?img=12' }
    ];

    return (
        <div className="min-h-screen bg-base-100 space-y-10 *:rounded-2xl">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-base-100 to-base-200">
                <div className="float-slow absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="float-fast absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
                        </div>
                        <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6">
                            Empowering Global
                            <br />
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                Earning Opportunities
                            </span>
                        </h1>
                        <p className="hero-subtitle text-xl text-base-content/70 max-w-3xl mx-auto">
                            We're building the world's most trusted micro-tasking platform, connecting skilled workers with meaningful opportunities and helping businesses achieve their goals efficiently.
                        </p>
                    </div>

                    <div className="hero-image max-w-5xl mx-auto">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-base-300">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop"
                                alt="Team collaboration"
                                className="w-full h-100 object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-base-300/80 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                ref={(el) => (statsRef.current[i] = el)}
                                className="bg-base-100 rounded-2xl p-8 text-center shadow-lg border border-base-300"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    <span className="stat-number" data-target={stat.value} data-decimal={stat.decimal}>0</span>
                                    <span>{stat.suffix}</span>
                                </div>
                                <div className="text-base-content/70 font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section ref={missionRef} className="py-20 px-4 relative overflow-hidden">
                <div className="mission-bg absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 -z-10"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="mission-content">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-primary font-semibold text-sm uppercase">Our Mission</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
                                Democratizing Work in the Digital Age
                            </h2>
                            <p className="text-lg text-base-content/70 mb-6 leading-relaxed">
                                We believe everyone deserves access to flexible earning opportunities regardless of location, background, or experience level. Our platform breaks down traditional employment barriers, enabling individuals to earn on their own terms while helping businesses scale efficiently.
                            </p>
                            <p className="text-lg text-base-content/70 leading-relaxed">
                                Through innovative technology and a commitment to fairness, we're creating an ecosystem where quality work is rewarded, trust is paramount, and growth is accessible to all.
                            </p>
                        </div>

                        <div className="mission-visual">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-linear-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-20"></div>
                                <div className="relative bg-base-200 rounded-3xl p-8 border border-base-300 shadow-xl">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="text-center p-6 bg-base-100 rounded-xl">
                                            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-base-content">Global Reach</div>
                                            <div className="text-sm text-base-content/70">15+ Countries</div>
                                        </div>
                                        <div className="text-center p-6 bg-base-100 rounded-xl">
                                            <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-base-content">Growth</div>
                                            <div className="text-sm text-base-content/70">300% YoY</div>
                                        </div>
                                        <div className="text-center p-6 bg-base-100 rounded-xl">
                                            <Shield className="w-10 h-10 text-accent mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-base-content">Secure</div>
                                            <div className="text-sm text-base-content/70">100% Protected</div>
                                        </div>
                                        <div className="text-center p-6 bg-base-100 rounded-xl">
                                            <Award className="w-10 h-10 text-info mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-base-content">Rated</div>
                                            <div className="text-sm text-base-content/70">4.9/5 Stars</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">Our Core Values</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            The principles that guide every decision we make and shape our platform's future.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (valuesRef.current[i] = el)}
                                    className="bg-base-100 rounded-2xl p-8 border border-base-300 shadow-lg cursor-pointer"
                                >
                                    <div className={`value-icon w-16 h-16 rounded-xl bg-${value.color}/10 flex items-center justify-center mb-6`}>
                                        <Icon className={`w-8 h-8 text-${value.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content mb-3">{value.title}</h3>
                                    <p className="text-base-content/70 leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="timeline-section py-20 px-4 bg-base-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">Our Journey</h2>
                        <p className="text-lg text-base-content/70">From humble beginnings to global impact.</p>
                    </div>

                    <div className="relative">
                        <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-secondary to-accent -translate-x-1/2 hidden lg:block"></div>

                        <div className="space-y-12">
                            {timeline.map((item, i) => {
                                const isEven = i % 2 === 0;
                                return (
                                    <div
                                        key={i}
                                        ref={(el) => (timelineRef.current[i] = el)}
                                        className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col gap-8`}
                                    >
                                        <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-inherit`}>
                                            <div className="bg-base-200 rounded-2xl p-6 border border-base-300 shadow-lg inline-block w-full lg:w-auto">
                                                <div className="text-3xl font-bold text-primary mb-2">{item.year}</div>
                                                <h3 className="text-xl font-bold text-base-content mb-2">{item.title}</h3>
                                                <p className="text-base-content/70">{item.description}</p>
                                            </div>
                                        </div>

                                        <div className="timeline-dot relative z-10 w-6 h-6 bg-linear-to-br from-primary to-secondary rounded-full border-4 border-base-100 shadow-lg shrink-0"></div>

                                        <div className="flex-1 hidden lg:block"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">Meet Our Team</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Passionate individuals dedicated to revolutionizing the future of work.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div
                                key={i}
                                ref={(el) => (teamRef.current[i] = el)}
                                className="group cursor-pointer"
                            >
                                <div className="bg-base-100 rounded-2xl overflow-hidden shadow-lg border border-base-300">
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="team-image w-full h-full object-cover"
                                        />
                                        <div className="team-overlay absolute inset-0 bg-linear-to-t from-base-300 to-transparent opacity-0 flex items-end p-6">
                                            <div className="text-base-100">
                                                <div className="font-bold text-lg">{member.name}</div>
                                                <div className="text-sm">{member.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-base-content mb-1">{member.name}</h3>
                                        <p className="text-base-content/70">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
