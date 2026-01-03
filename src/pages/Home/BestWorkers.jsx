import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, TrendingUp } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Mock data for development - replace with actual API call
const mockWorkers = [
    {
        _id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=1',
        coin: 2450,
        role: 'worker'
    },
    {
        _id: '2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=13',
        coin: 2180,
        role: 'worker'
    },
    {
        _id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=5',
        coin: 1950,
        role: 'worker'
    },
    {
        _id: '4',
        name: 'James Wilson',
        email: 'james.w@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=12',
        coin: 1820,
        role: 'worker'
    },
    {
        _id: '5',
        name: 'Aisha Patel',
        email: 'aisha.p@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=9',
        coin: 1650,
        role: 'worker'
    },
    {
        _id: '6',
        name: 'David Kim',
        email: 'david.k@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=14',
        coin: 1520,
        role: 'worker'
    }
];

const BestWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);
    const ctaRef = useRef(null);

    // Fetch top workers from API
    useEffect(() => {
        const fetchTopWorkers = async () => {
            try {
                setLoading(true);

                // Replace with actual API endpoint
                // const response = await fetch('http://localhost:5000/api/workers/top', {
                //   headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`
                //   }
                // });

                // if (!response.ok) throw new Error('Failed to fetch workers');
                // const data = await response.json();

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Using mock data for now
                const sortedWorkers = [...mockWorkers]
                    .sort((a, b) => b.coin - a.coin)
                    .slice(0, 6);

                setWorkers(sortedWorkers);
                setError(null);
            } catch (err) {
                console.error('Error fetching workers:', err);
                setError('Unable to load top workers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopWorkers();
    }, []);

    // GSAP animations with ScrollTrigger
    useEffect(() => {
        if (workers.length === 0 || loading) return;

        const ctx = gsap.context(() => {
            // Title animation with ScrollTrigger
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 85%',
                    end: 'top 60%',
                    scrub: 1,
                },
                opacity: 0,
                y: -50,
                scale: 0.9,
                duration: 1
            });

            // Individual card animations with complex effects
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                const direction = index % 2 === 0 ? -100 : 100;
                const rotation = index % 2 === 0 ? -5 : 5;

                // Create timeline for each card
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        end: 'top 50%',
                        scrub: 1.5,
                    }
                });

                tl.from(card, {
                    x: direction,
                    y: 80,
                    opacity: 0,
                    scale: 0.8,
                    rotation: rotation,
                    duration: 1,
                    ease: 'power3.out'
                })
                    .to(card, {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
            });

            // CTA animation with ScrollTrigger
            if (ctaRef.current) {
                gsap.from(ctaRef.current, {
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: 'top 90%',
                        end: 'top 70%',
                        scrub: 1,
                    },
                    opacity: 0,
                    y: 40,
                    scale: 0.95,
                    duration: 0.8
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [workers, loading]);

    // Hover interactions using GSAP
    useEffect(() => {
        if (workers.length === 0 || loading) return;

        cardsRef.current.forEach((card) => {
            if (!card) return;

            const handleMouseEnter = () => {
                gsap.to(card, {
                    scale: 1.05,
                    y: -10,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                    duration: 0.4,
                    ease: 'power2.out'
                });

                // Animate rank badge
                const badge = card.querySelector('.rank-badge');
                if (badge) {
                    gsap.to(badge, {
                        rotation: 360,
                        scale: 1.15,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }

                // Animate coin display
                const coinDisplay = card.querySelector('.coin-display');
                if (coinDisplay) {
                    gsap.to(coinDisplay, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    duration: 0.4,
                    ease: 'power2.out'
                });

                const badge = card.querySelector('.rank-badge');
                if (badge) {
                    gsap.to(badge, {
                        rotation: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }

                const coinDisplay = card.querySelector('.coin-display');
                if (coinDisplay) {
                    gsap.to(coinDisplay, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, [workers, loading]);

    // Get rank badge color
    const getRankBadge = (index) => {
        const badges = [
            { icon: '🥇', color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900' },
            { icon: '🥈', color: 'from-gray-300 to-gray-500', text: 'text-gray-900' },
            { icon: '🥉', color: 'from-orange-400 to-orange-600', text: 'text-orange-900' },
            { icon: '🏅', color: 'from-blue-400 to-blue-600', text: 'text-blue-100' },
            { icon: '🏅', color: 'from-purple-400 to-purple-600', text: 'text-purple-100' },
            { icon: '🏅', color: 'from-pink-400 to-pink-600', text: 'text-pink-100' }
        ];
        return badges[index] || badges[3];
    };

    if (loading) {
        return (
            <section className="py-16 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="h-10 w-64 bg-base-300 rounded-lg animate-pulse mx-auto mb-4"></div>
                        <div className="h-6 w-96 bg-base-300 rounded-lg animate-pulse mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-base-200 rounded-2xl p-6 animate-pulse">
                                <div className="w-24 h-24 bg-base-300 rounded-full mx-auto mb-4"></div>
                                <div className="h-6 w-32 bg-base-300 rounded mx-auto mb-2"></div>
                                <div className="h-8 w-24 bg-base-300 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-error/10 border border-error/20 rounded-xl p-8">
                        <p className="text-error text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-error mt-4"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (workers.length === 0) {
        return (
            <section className="py-16 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-base-200 rounded-xl p-12">
                        <Award className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
                        <p className="text-xl text-base-content/70">No workers found yet. Be the first to start earning!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="py-20 px-4 bg-base-100 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                            Top Performers
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Best Workers
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Meet our highest-earning workers who consistently deliver exceptional results
                    </p>
                </div>

                {/* Workers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {workers.map((worker, index) => {
                        const rankBadge = getRankBadge(index);

                        return (
                            <article
                                key={worker._id}
                                ref={(el) => (cardsRef.current[index] = el)}
                                className="relative bg-base-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-base-300"
                                aria-label={`${worker.name} - ${worker.coin} coins`}
                            >
                                {/* Rank Badge */}
                                <div className={`rank-badge absolute -top-4 -right-4 w-14 h-14 rounded-full bg-linear-to-br ${rankBadge.color} flex items-center justify-center text-2xl shadow-lg z-10`}>
                                    {rankBadge.icon}
                                </div>

                                {/* Rank Number */}
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-base-300 flex items-center justify-center font-bold text-sm text-base-content">
                                    #{index + 1}
                                </div>

                                {/* Profile Picture */}
                                <div className="flex justify-center mb-4 mt-2">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-accent/20 shadow-xl">
                                            <img
                                                src={worker.photo_url}
                                                alt={`${worker.name}'s profile`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random&size=200`;
                                                }}
                                            />
                                        </div>
                                        {/* Online indicator */}
                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-4 border-base-200"></div>
                                    </div>
                                </div>

                                {/* Worker Info */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-base-content mb-1 truncate">
                                        {worker.name}
                                    </h3>
                                    <p className="text-sm text-base-content/60 mb-4 truncate">
                                        {worker.email}
                                    </p>

                                    {/* Coins Display */}
                                    <div className="coin-display bg-linear-to-r from-accent/20 to-accent/10 rounded-xl p-4 border border-accent/30">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                                <span className="text-xl">🪙</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-base-content/60 uppercase tracking-wide">
                                                    Total Earned
                                                </p>
                                                <p className="text-2xl font-bold text-accent">
                                                    {worker.coin.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent/0 via-accent/50 to-accent/0 rounded-t-2xl"></div>
                            </article>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div ref={ctaRef} className="text-center mt-12">
                    <p className="text-base-content/70 mb-4">
                        Want to join the leaderboard?
                    </p>
                    <a
                        href="/register"
                        className="btn btn-primary btn-lg gap-2"
                    >
                        Start Earning Today
                        <TrendingUp className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BestWorkers;
