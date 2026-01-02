import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Coins, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Slider from '../../components/Slider';

const Banner = () => {
    const bannerRef = useRef(null);
    const currentSlideRef = useRef(0);

    const slides = [
        {
            title: "Earn Real Money From Micro Tasks",
            subtitle: "Join 50,000+ Workers Worldwide",
            description: "Complete simple tasks, get verified instantly, and receive payments directly to your account. No experience required.",
            icon: Coins,
            gradient: "from-base-100/95 via-base-100/85 to-transparent",
            image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1600&h=900&fit=crop&q=80",
            features: ["Instant Payments", "24/7 Support", "No Hidden Fees"],
            ctaPrimary: "Start Earning Now",
            ctaSecondary: "View Available Tasks"
        },
        {
            title: "Get Quality Work Done Faster",
            subtitle: "Trusted by 10,000+ Businesses",
            description: "Post your tasks and connect with verified workers. Scale your business with our global workforce.",
            icon: Users,
            gradient: "from-base-100/95 via-base-100/85 to-transparent",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop&q=80",
            features: ["Verified Workers", "Quick Turnaround", "Quality Guaranteed"],
            ctaPrimary: "Post Your First Task",
            ctaSecondary: "See How It Works"
        },
        {
            title: "Track & Grow Your Earnings",
            subtitle: "Transparent. Secure. Reliable.",
            description: "Monitor your progress with real-time analytics. Withdraw earnings through multiple secure payment methods anytime.",
            icon: TrendingUp,
            gradient: "from-base-100/95 via-base-100/85 to-transparent",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&q=80",
            features: ["Real-time Stats", "Secure Withdrawals", "Multiple Payment Options"],
            ctaPrimary: "View Dashboard",
            ctaSecondary: "Learn About Payments"
        }
    ];

    const animateSlide = (index) => {
        currentSlideRef.current = index;
        const slideElement = bannerRef.current?.querySelector(`[data-slide="${index}"]`);
        if (!slideElement) return;

        const title = slideElement.querySelector('[data-animate="title"]');
        const subtitle = slideElement.querySelector('[data-animate="subtitle"]');
        const description = slideElement.querySelector('[data-animate="description"]');
        const features = slideElement.querySelector('[data-animate="features"]');
        const cta = slideElement.querySelector('[data-animate="cta"]');
        const image = slideElement.querySelector('[data-animate="image"]');
        const overlay = slideElement.querySelector('[data-animate="overlay"]');
        const badge = slideElement.querySelector('[data-animate="badge"]');

        // Reset positions
        gsap.set([title, subtitle, description, features, cta], {
            opacity: 0,
            y: 40
        });
        gsap.set(badge, {
            opacity: 0,
            scale: 0.8,
            y: 20
        });
        gsap.set(image, {
            opacity: 0,
            scale: 1.15
        });
        gsap.set(overlay, {
            opacity: 0
        });

        // Create animation timeline
        const tl = gsap.timeline();

        tl.to(image, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
        })
            .to(overlay, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.8")
            .to(badge, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.4)"
            }, "-=0.4")
            .to(title, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            }, "-=0.3")
            .to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.5")
            .to(description, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.4")
            .to(features, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.4")
            .to(cta, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.4)"
            }, "-=0.3");
    };

    useEffect(() => {
        animateSlide(0);
    }, []);

    const renderSlide = (slide, index) => {
        const Icon = slide.icon;

        return (
            <div
                data-slide={index}
                className="relative w-full h-135 md:h-150 lg:h-165 overflow-hidden"
            >
                {/* Background Image */}
                <div
                    data-animate="image"
                    className="absolute inset-0"
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Gradient Overlay */}
                <div
                    data-animate="overlay"
                    className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`}
                />

                {/* Content Container */}
                <div className="relative h-full flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                        <div className="max-w-2xl lg:max-w-3xl">
                            {/* Icon Badge */}
                            <div
                                data-animate="badge"
                                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent backdrop-blur-md border border-accent-content/10"
                            >
                                <Icon className="w-5 h-5 text-accent-content" />
                                <span className="text-sm font-semibold text-accent-content tracking-wide">
                                    {index === 0 ? "FOR WORKERS" : index === 1 ? "FOR BUSINESSES" : "TRACK PROGRESS"}
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                data-animate="title"
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-base-content mb-3 md:mb-4 leading-tight tracking-tight"
                            >
                                {slide.title}
                            </h1>

                            {/* Subtitle */}
                            <p
                                data-animate="subtitle"
                                className="text-lg sm:text-xl md:text-2xl font-bold text-base-content/90 mb-4 md:mb-6"
                            >
                                {slide.subtitle}
                            </p>

                            {/* Description */}
                            <p
                                data-animate="description"
                                className="text-sm sm:text-base md:text-lg text-base-content/70 mb-6 md:mb-8 max-w-xl leading-relaxed"
                            >
                                {slide.description}
                            </p>

                            {/* Features List */}
                            <div
                                data-animate="features"
                                className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8"
                            >
                                {slide.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-content/5 backdrop-blur-sm border border-base-content/10"
                                    >
                                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-base-content/80">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div
                                data-animate="cta"
                                className="flex flex-col sm:flex-row gap-3 md:gap-4"
                            >
                                <button className="btn btn-lg bg-accent hover:bg-accent text-accent-content border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <span>{slide.ctaPrimary}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="btn btn-lg btn-outline border-2 border-base-content/20 hover:border-base-content/40 text-base-content hover:bg-base-content/5 backdrop-blur-sm">
                                    {slide.ctaSecondary}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-32 h-32 bg-accent rounded-full blur-3xl" />
                <div className="absolute bottom-8 left-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
            </div>
        );
    };

    return (
        <section ref={bannerRef} className="w-full">
            <Slider
                slides={slides}
                autoPlay={true}
                autoPlayInterval={7000}
                renderSlide={renderSlide}
                onSlideChange={animateSlide}
            />
        </section>
    );
};

export default Banner;
