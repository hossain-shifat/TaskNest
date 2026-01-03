import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Search,
    HelpCircle,
    BookOpen,
    Video,
    MessageCircle,
    Mail,
    User,
    Briefcase,
    Shield,
    Coins,
    CreditCard,
    Settings,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Help = () => {
    const heroRef = useRef(null);
    const categoriesRef = useRef([]);
    const faqRefs = useRef([]);
    const guidesRef = useRef([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedFaq, setExpandedFaq] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            const heroTl = gsap.timeline();
            heroTl
                .from('.help-badge', {
                    scale: 0,
                    rotation: -180,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(2)'
                })
                .from('.help-title', {
                    y: 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power3.out'
                }, '-=0.4')
                .from('.help-subtitle', {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.5')
                .from('.search-bar', {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(1.4)'
                }, '-=0.3');

            // Categories animation
            categoriesRef.current.forEach((card, i) => {
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
                    delay: i * 0.08
                });

                gsap.from(card.querySelector('.category-icon'), {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotation: 180,
                    scale: 0,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    delay: i * 0.08 + 0.2
                });

                // Hover effect
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -8,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.category-icon'), {
                        rotation: 10,
                        scale: 1.1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.category-icon'), {
                        rotation: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // FAQ animation
            faqRefs.current.forEach((faq, i) => {
                if (!faq) return;

                gsap.from(faq, {
                    scrollTrigger: {
                        trigger: faq,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    x: i % 2 === 0 ? -50 : 50,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            });

            // Guides animation
            guidesRef.current.forEach((guide, i) => {
                if (!guide) return;

                gsap.from(guide, {
                    scrollTrigger: {
                        trigger: guide,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    delay: i * 0.1
                });
            });

            // Floating elements
            gsap.to('.float-element', {
                y: -25,
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.4
            });

        });

        return () => ctx.revert();
    }, []);

    const toggleFaq = (index) => {
        const faq = faqRefs.current[index];
        const answer = faq?.querySelector('.faq-answer');
        const icon = faq?.querySelector('.faq-toggle-icon');

        if (expandedFaq === index) {
            gsap.to(answer, {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });
            gsap.to(icon, {
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            setExpandedFaq(null);
        } else {
            if (expandedFaq !== null) {
                const prevAnswer = faqRefs.current[expandedFaq]?.querySelector('.faq-answer');
                const prevIcon = faqRefs.current[expandedFaq]?.querySelector('.faq-toggle-icon');
                gsap.to(prevAnswer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
                gsap.to(prevIcon, {
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            gsap.set(answer, { height: 'auto' });
            gsap.from(answer, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            gsap.to(icon, {
                rotation: 180,
                duration: 0.3,
                ease: 'power2.out'
            });
            setExpandedFaq(index);
        }
    };

    const categories = [
        {
            icon: User,
            title: 'Getting Started',
            description: 'Learn how to create an account and start earning',
            articles: 12,
            color: 'primary'
        },
        {
            icon: Briefcase,
            title: 'Tasks & Submissions',
            description: 'Everything about finding and completing tasks',
            articles: 18,
            color: 'secondary'
        },
        {
            icon: Coins,
            title: 'Coins & Earnings',
            description: 'Understanding the coin system and payments',
            articles: 15,
            color: 'accent'
        },
        {
            icon: CreditCard,
            title: 'Withdrawals',
            description: 'How to withdraw your earnings safely',
            articles: 10,
            color: 'info'
        },
        {
            icon: Shield,
            title: 'Account & Security',
            description: 'Keep your account safe and secure',
            articles: 14,
            color: 'warning'
        },
        {
            icon: Settings,
            title: 'Platform Settings',
            description: 'Customize your experience and preferences',
            articles: 8,
            color: 'success'
        }
    ];

    const faqs = [
        {
            question: 'How do I create an account?',
            answer: 'Click the Register button in the navigation bar. Choose your role (Worker or Buyer), fill in your details including name, email, profile picture URL, and password. Workers receive 10 coins upon registration, while Buyers get 50 coins to start.',
            category: 'getting-started'
        },
        {
            question: 'What is the minimum withdrawal amount?',
            answer: 'Workers can withdraw when they reach 200 coins minimum, which equals $10. The conversion rate for withdrawal is 20 coins = $1. You can choose from multiple payment methods including Stripe, Bkash, Rocket, and Nagad.',
            category: 'withdrawals'
        },
        {
            question: 'How does the coin system work?',
            answer: 'Workers earn coins by completing approved tasks. Buyers purchase coins to pay for tasks (10 coins = $1). When withdrawing, workers convert at 20 coins = $1. This conversion difference is how the platform generates revenue while keeping the service sustainable.',
            category: 'coins'
        },
        {
            question: 'What happens if my task submission is rejected?',
            answer: 'If a Buyer rejects your submission, you will receive a notification with the reason. The task becomes available again for other workers as the required_workers count increases by 1. You can immediately attempt other available tasks.',
            category: 'tasks'
        },
        {
            question: 'How long does task approval take?',
            answer: 'Approval time varies by buyer, but most tasks are reviewed within 24-48 hours. You will receive real-time notifications when your submission is reviewed. You can track all submission statuses from the My Submissions page in your dashboard.',
            category: 'tasks'
        },
        {
            question: 'Can I change my role from Worker to Buyer?',
            answer: 'Yes, platform admins can update user roles. Contact support through the Contact page if you need to switch between Worker, Buyer, or Admin roles. Your coin balance will be preserved during role changes.',
            category: 'account'
        },
        {
            question: 'How secure are my payments?',
            answer: 'We implement bank-level security with SSL/TLS encryption, role-based authorization, and secure payment processing through Stripe. Your financial information is never stored on our servers. All transactions are encrypted and monitored for suspicious activity.',
            category: 'security'
        },
        {
            question: 'How do I find tasks suitable for me?',
            answer: 'Navigate to the TaskList page from your Worker dashboard. You will see all available tasks where required_workers is greater than 0. Each task shows the title, buyer name, deadline, payment amount, and required workers. Click View Details to see full task information before submitting.',
            category: 'tasks'
        }
    ];

    const quickGuides = [
        {
            icon: BookOpen,
            title: 'Complete Your First Task',
            description: 'Step-by-step guide to earning your first coins',
            duration: '5 min read',
            type: 'Guide'
        },
        {
            icon: Video,
            title: 'Platform Video Tutorial',
            description: 'Watch how to navigate the platform effectively',
            duration: '10 min watch',
            type: 'Video'
        },
        {
            icon: CreditCard,
            title: 'Withdrawal Process Explained',
            description: 'Learn how to cash out your earnings',
            duration: '4 min read',
            type: 'Guide'
        },
        {
            icon: Shield,
            title: 'Security Best Practices',
            description: 'Keep your account and earnings safe',
            duration: '6 min read',
            type: 'Guide'
        }
    ];

    return (
        <div className="min-h-screen bg-base-100 space-y-10 *:rounded-2xl">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-base-100 to-base-200">
                <div className="float-element absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="float-element absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="float-element absolute top-1/2 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="help-badge inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Help Center</span>
                    </div>
                    <h1 className="help-title text-5xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6">
                        How Can We
                        <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Help You Today?
                        </span>
                    </h1>
                    <p className="help-subtitle text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
                        Find answers to your questions, explore guides, and get the support you need to succeed on our platform.
                    </p>

                    {/* Search Bar */}
                    <div className="search-bar max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search for help articles, guides, or FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-base-100 border-2 border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base-content shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Browse by Category</h2>
                        <p className="text-lg text-base-content/70">Find the information you need organized by topic</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, i) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (categoriesRef.current[i] = el)}
                                    className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-lg cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`category-icon w-14 h-14 rounded-xl bg-${category.color}/10 flex items-center justify-center`}>
                                            <Icon className={`w-7 h-7 text-${category.color}`} />
                                        </div>
                                        <span className="text-xs font-semibold text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
                                            {category.articles} articles
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-base-content/70 mb-4">{category.description}</p>
                                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                                        <span>Explore</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quick Guides */}
            <section className="py-20 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Quick Start Guides</h2>
                        <p className="text-lg text-base-content/70">Essential resources to get you up and running fast</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickGuides.map((guide, i) => {
                            const Icon = guide.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (guidesRef.current[i] = el)}
                                    className="bg-base-200 rounded-2xl p-6 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                            <Icon className="w-6 h-6 text-primary-content" />
                                        </div>
                                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                            {guide.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                                        {guide.title}
                                    </h3>
                                    <p className="text-sm text-base-content/70 mb-3">{guide.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-base-content/60">{guide.duration}</span>
                                        <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-base-content/70">Quick answers to common questions</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                ref={(el) => (faqRefs.current[i] = el)}
                                className="bg-base-100 rounded-xl shadow-md border border-base-300 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-base-200/50 transition-colors duration-200"
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <HelpCircle className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-lg font-bold text-base-content">{faq.question}</span>
                                    </div>
                                    <div className="faq-toggle-icon shrink-0 w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
                                        <ChevronDown className="w-5 h-5 text-base-content" />
                                    </div>
                                </button>

                                <div
                                    className="faq-answer overflow-hidden"
                                    style={{ height: 0, opacity: 0 }}
                                >
                                    <div className="px-6 pb-5">
                                        <div className="pl-9 pt-2 border-t border-base-300">
                                            <p className="text-base-content/80 leading-relaxed pt-4">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Contact */}
            <section className="bg-base-100 overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 border border-base-300 shadow-xl">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                                    Still Need Help?
                                </h2>
                                <p className="text-lg text-base-content/70 mb-6">
                                    Our support team is available 24/7 to assist you with any questions or issues you may have.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span className="text-base-content/80">Average response time: 2 hours</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span className="text-base-content/80">Multi-language support available</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span className="text-base-content/80">Dedicated team for complex issues</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Live Chat Support</span>
                                </button>
                                <button className="w-full btn btn-secondary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <Mail className="w-5 h-5" />
                                    <span>Email Support</span>
                                </button>
                                <div className="text-center pt-4">
                                    <p className="text-sm text-base-content/60">
                                        Or call us at <span className="font-semibold text-primary">+1 (555) 123-4567</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Help;
