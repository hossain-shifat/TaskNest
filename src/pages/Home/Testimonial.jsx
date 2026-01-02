import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Mock testimonial data
const testimonials = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        role: 'Freelance Designer',
        photo: 'https://i.pravatar.cc/150?img=1',
        quote: 'This platform transformed my income stream! The tasks are straightforward, payments are instant, and I\'ve earned over $2,000 in just three months. Highly recommended!',
        rating: 5,
        earned: 2450
    },
    {
        id: 2,
        name: 'David Chen',
        role: 'Digital Marketer',
        photo: 'https://i.pravatar.cc/150?img=13',
        quote: 'As a buyer, creating tasks is incredibly simple. The worker pool is talented and responsive. My projects get completed faster than any other platform I\'ve used.',
        rating: 5,
        earned: 3200
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Content Writer',
        photo: 'https://i.pravatar.cc/150?img=5',
        quote: 'I love the flexibility! I can work whenever I want, choose tasks that interest me, and the withdrawal process is seamless. This is my go-to side income source.',
        rating: 5,
        earned: 1890
    },
    {
        id: 4,
        name: 'Michael Park',
        role: 'Software Developer',
        photo: 'https://i.pravatar.cc/150?img=12',
        quote: 'The quality of workers on this platform is exceptional. I get detailed submissions and can communicate easily. It\'s made outsourcing micro-tasks effortless.',
        rating: 5,
        earned: 4100
    },
    {
        id: 5,
        name: 'Aisha Patel',
        role: 'Social Media Manager',
        photo: 'https://i.pravatar.cc/150?img=9',
        quote: 'Been using this for 6 months now. The earning potential is real, and the community is supportive. The platform is well-designed and user-friendly.',
        rating: 5,
        earned: 2780
    },
    {
        id: 6,
        name: 'James Wilson',
        role: 'Virtual Assistant',
        photo: 'https://i.pravatar.cc/150?img=14',
        quote: 'Finally, a micro-tasking platform that actually pays well and on time! The dashboard is intuitive, and I appreciate the transparency in all transactions.',
        rating: 5,
        earned: 3450
    }
];

const Testimonial = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const cardsRef = useRef([]);
    const swiperContainerRef = useRef(null);

    // Initialize GSAP animations with ScrollTrigger
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
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

            // Floating animation for decorative elements
            gsap.to('.float-element', {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.3
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Hover interactions using GSAP
    useEffect(() => {
        cardsRef.current.forEach((card) => {
            if (!card) return;

            const handleMouseEnter = () => {
                gsap.to(card, {
                    scale: 1.05,
                    y: -10,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                    backgroundColor: 'oklch(var(--color-base-200))',
                    duration: 0.4,
                    ease: 'power2.out'
                });

                // Animate inner elements
                gsap.to(card.querySelector('.quote-icon'), {
                    rotation: 360,
                    scale: 1.2,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });

                gsap.to(card.querySelector('.testimonial-text'), {
                    color: 'oklch(var(--color-accent))',
                    duration: 0.3
                });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'oklch(var(--color-base-100))',
                    duration: 0.4,
                    ease: 'power2.out'
                });

                gsap.to(card.querySelector('.quote-icon'), {
                    rotation: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });

                gsap.to(card.querySelector('.testimonial-text'), {
                    color: 'oklch(var(--color-base-content) / 0.8)',
                    duration: 0.3
                });
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, []);

    // Manual swiper implementation
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    // Render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-warning text-warning' : 'text-base-300'}`}
            />
        ));
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-20 px-4 bg-linear-to-br from-base-100 via-base-200 to-base-100 overflow-hidden rounded-2xl"
        >
            {/* Decorative background elements */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl float-element"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl float-element" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl float-element" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
                        <Quote className="w-5 h-5 text-accent" />
                        <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Join thousands of satisfied workers and buyers who trust our platform for their micro-tasking needs
                    </p>
                </div>

                {/* Desktop Grid View (Hidden on mobile) */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12" ref={cardsContainerRef}>
                    {testimonials.map((testimonial, index) => (
                        <article
                            key={testimonial.id}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="bg-base-100 rounded-2xl p-8 shadow-lg border border-base-300 relative overflow-hidden"
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-accent/10 to-transparent rounded-bl-full"></div>

                            {/* Quote Icon */}
                            <div className="quote-icon absolute top-6 right-6 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                <Quote className="w-6 h-6 text-accent" />
                            </div>

                            {/* Profile */}
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-accent/20">
                                        <img
                                            src={testimonial.photo}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                                            }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-base-content">{testimonial.name}</h3>
                                    <p className="text-sm text-base-content/60">{testimonial.role}</p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {renderStars(testimonial.rating)}
                            </div>

                            {/* Quote */}
                            <blockquote className="testimonial-text text-base-content/80 leading-relaxed mb-6">
                                "{testimonial.quote}"
                            </blockquote>

                            {/* Earnings Badge */}
                            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                                <span className="text-xl">🪙</span>
                                <span className="text-sm font-semibold text-accent">
                                    ${testimonial.earned.toLocaleString()} earned
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Mobile/Tablet Swiper View */}
                <div className="lg:hidden relative" ref={swiperContainerRef}>
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <article
                                    key={testimonial.id}
                                    className="min-w-full px-4"
                                >
                                    <div className="bg-base-100 rounded-2xl p-8 shadow-lg border border-base-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-accent/10 to-transparent rounded-bl-full"></div>

                                        <div className="quote-icon absolute top-6 right-6 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <Quote className="w-6 h-6 text-accent" />
                                        </div>

                                        <div className="flex items-center gap-4 mb-6 relative z-10">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-accent/20">
                                                    <img
                                                        src={testimonial.photo}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-base-content">{testimonial.name}</h3>
                                                <p className="text-sm text-base-content/60">{testimonial.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>

                                        <blockquote className="testimonial-text text-base-content/80 leading-relaxed mb-6">
                                            "{testimonial.quote}"
                                        </blockquote>

                                        <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                                            <span className="text-xl">🪙</span>
                                            <span className="text-sm font-semibold text-accent">
                                                ${testimonial.earned.toLocaleString()} earned
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-base-100 rounded-full shadow-lg flex items-center justify-center hover:bg-accent hover:text-accent-content transition-all duration-300 border border-base-300 z-20"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-base-100 rounded-full shadow-lg flex items-center justify-center hover:bg-accent hover:text-accent-content transition-all duration-300 border border-base-300 z-20"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                        ? 'bg-accent w-8'
                                        : 'bg-base-300 hover:bg-base-content/30'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                    {[
                        { value: '10K+', label: 'Active Users' },
                        { value: '50K+', label: 'Tasks Completed' },
                        { value: '$2M+', label: 'Total Earnings' },
                        { value: '4.9/5', label: 'Average Rating' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-base-100 rounded-xl p-6 text-center border border-base-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                            <div className="text-sm text-base-content/70">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
