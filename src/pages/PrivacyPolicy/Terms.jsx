import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Shield,
    Lock,
    Eye,
    FileText,
    Users,
    Cookie,
    Database,
    AlertCircle,
    CheckCircle,
    Calendar,
    Mail
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Terms = () => {
    const heroRef = useRef(null);
    const tocRef = useRef(null);
    const sectionsRef = useRef([]);
    const highlightsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            const heroTl = gsap.timeline();
            heroTl
                .from('.privacy-badge', {
                    scale: 0,
                    rotation: -180,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(2)'
                })
                .from('.privacy-title', {
                    y: 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power3.out'
                }, '-=0.4')
                .from('.privacy-subtitle', {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.5')
                .from('.last-updated', {
                    opacity: 0,
                    duration: 0.5
                }, '-=0.3');

            // Table of contents animation
            gsap.from('.toc-container', {
                scrollTrigger: {
                    trigger: tocRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from('.toc-item', {
                scrollTrigger: {
                    trigger: tocRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });

            // Highlights cards
            highlightsRef.current.forEach((card, i) => {
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

                gsap.from(card.querySelector('.highlight-icon'), {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotation: -180,
                    scale: 0,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    delay: i * 0.1 + 0.2
                });
            });

            // Content sections
            sectionsRef.current.forEach((section, i) => {
                if (!section) return;

                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });

                // Section icon animation
                const icon = section.querySelector('.section-icon');
                if (icon) {
                    gsap.from(icon, {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        },
                        scale: 0,
                        rotation: 90,
                        duration: 0.5,
                        ease: 'back.out(2)',
                        delay: 0.2
                    });
                }
            });

            // Floating elements
            gsap.to('.float-slow', {
                y: -20,
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });

            gsap.to('.float-fast', {
                y: -15,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
                delay: 0.5
            });

        });

        return () => ctx.revert();
    }, []);

    const tableOfContents = [
        { id: 'information-collection', title: 'Information We Collect' },
        { id: 'data-usage', title: 'How We Use Your Data' },
        { id: 'data-sharing', title: 'Data Sharing & Disclosure' },
        { id: 'data-security', title: 'Data Security' },
        { id: 'cookies', title: 'Cookies & Tracking' },
        { id: 'user-rights', title: 'Your Rights' },
        { id: 'data-retention', title: 'Data Retention' },
        { id: 'changes', title: 'Policy Changes' }
    ];

    const highlights = [
        {
            icon: Lock,
            title: 'Bank-Level Encryption',
            description: 'All data encrypted using industry-standard protocols',
            color: 'primary'
        },
        {
            icon: Eye,
            title: 'Full Transparency',
            description: 'Clear information about data collection and usage',
            color: 'secondary'
        },
        {
            icon: Users,
            title: 'User Control',
            description: 'You control your data and privacy preferences',
            color: 'accent'
        },
        {
            icon: Shield,
            title: 'GDPR Compliant',
            description: 'Following international privacy standards',
            color: 'info'
        }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-base-100 space-y-10 *:rounded-2xl">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-base-100 to-base-200">
                <div className="float-slow absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="float-fast absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="privacy-badge inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Privacy Policy</span>
                    </div>
                    <h1 className="privacy-title text-5xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6">
                        Your Privacy,
                        <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Our Priority
                        </span>
                    </h1>
                    <p className="privacy-subtitle text-xl text-base-content/70 max-w-2xl mx-auto mb-6">
                        We're committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
                    </p>
                    <div className="last-updated inline-flex items-center gap-2 px-4 py-2 bg-base-200 rounded-full border border-base-300">
                        <Calendar className="w-4 h-4 text-base-content/60" />
                        <span className="text-sm text-base-content/70">Last Updated: January 3, 2026</span>
                    </div>
                </div>
            </section>

            {/* Key Highlights */}
            <section className="py-16 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {highlights.map((highlight, i) => {
                            const Icon = highlight.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (highlightsRef.current[i] = el)}
                                    className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-lg"
                                >
                                    <div className={`highlight-icon w-14 h-14 rounded-xl bg-${highlight.color}/10 flex items-center justify-center mb-4`}>
                                        <Icon className={`w-7 h-7 text-${highlight.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-base-content mb-2">{highlight.title}</h3>
                                    <p className="text-sm text-base-content/70">{highlight.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className=" px-4 bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Table of Contents - Sticky Sidebar */}
                        <div ref={tocRef} className="lg:col-span-1">
                            <div className="toc-container lg:sticky lg:top-8">
                                <div className="bg-base-200 rounded-2xl p-6 border border-base-300 shadow-lg">
                                    <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Contents
                                    </h3>
                                    <nav className="space-y-2">
                                        {tableOfContents.map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => scrollToSection(item.id)}
                                                className="toc-item w-full text-left px-3 py-2 rounded-lg text-sm text-base-content/70 hover:bg-base-100 hover:text-primary transition-all duration-200"
                                            >
                                                {item.title}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Policy Content */}
                        <div className="lg:col-span-3 space-y-12">
                            {/* Section 1: Information Collection */}
                            <div id="information-collection" ref={(el) => (sectionsRef.current[0] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Database className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Information We Collect</h2>
                                            <p className="text-base-content/70">Understanding what data we gather and why</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <div>
                                            <h3 className="text-xl font-bold text-base-content mb-3">Personal Information</h3>
                                            <p className="mb-3">When you register on our platform, we collect:</p>
                                            <ul className="space-y-2 ml-6">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Name, email address, and profile picture for account creation</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Payment information for coin purchases and withdrawals</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Task submissions and work samples you provide</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Communication data when you contact support</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-base-content mb-3">Automatically Collected Data</h3>
                                            <p className="mb-3">We automatically collect certain technical information:</p>
                                            <ul className="space-y-2 ml-6">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>IP address, browser type, and device information</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Usage patterns, pages visited, and time spent on platform</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                    <span>Login timestamps and activity logs for security</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Data Usage */}
                            <div id="data-usage" ref={(el) => (sectionsRef.current[1] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                                            <Users className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">How We Use Your Data</h2>
                                            <p className="text-base-content/70">The purposes behind data collection</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We use your information to:</p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <h4 className="font-bold text-base-content mb-2">Platform Operations</h4>
                                                <p className="text-sm">Create and manage your account, process transactions, match you with tasks, and facilitate communications between users.</p>
                                            </div>
                                            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <h4 className="font-bold text-base-content mb-2">Service Improvement</h4>
                                                <p className="text-sm">Analyze usage patterns, improve features, personalize experience, and develop new functionality.</p>
                                            </div>
                                            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <h4 className="font-bold text-base-content mb-2">Security & Fraud Prevention</h4>
                                                <p className="text-sm">Detect suspicious activity, prevent unauthorized access, verify identities, and protect all users.</p>
                                            </div>
                                            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <h4 className="font-bold text-base-content mb-2">Communication</h4>
                                                <p className="text-sm">Send notifications, platform updates, support responses, and important announcements.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Data Sharing */}
                            <div id="data-sharing" ref={(el) => (sectionsRef.current[2] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Data Sharing & Disclosure</h2>
                                            <p className="text-base-content/70">When and with whom we share information</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We may share your data with:</p>
                                        <ul className="space-y-3">
                                            <li className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <div className="font-bold text-base-content mb-1">Other Platform Users</div>
                                                <p className="text-sm">Workers and Buyers see limited profile information necessary for task completion and communication.</p>
                                            </li>
                                            <li className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <div className="font-bold text-base-content mb-1">Service Providers</div>
                                                <p className="text-sm">Payment processors (Stripe), email services, and hosting providers who help operate our platform.</p>
                                            </li>
                                            <li className="bg-base-100 rounded-xl p-4 border border-base-300">
                                                <div className="font-bold text-base-content mb-1">Legal Requirements</div>
                                                <p className="text-sm">When required by law, court order, or to protect rights and safety of users and the platform.</p>
                                            </li>
                                        </ul>
                                        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                                            <p className="text-sm"><strong>Important:</strong> We never sell your personal data to third parties for marketing purposes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Data Security */}
                            <div id="data-security" ref={(el) => (sectionsRef.current[3] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                                            <Lock className="w-6 h-6 text-info" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Data Security</h2>
                                            <p className="text-base-content/70">How we protect your information</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We implement industry-standard security measures:</p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-success" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base-content">SSL/TLS Encryption</div>
                                                    <p className="text-sm">All data transmitted is encrypted</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-success" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base-content">Secure Authentication</div>
                                                    <p className="text-sm">Firebase Auth with token-based access</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-success" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base-content">Regular Security Audits</div>
                                                    <p className="text-sm">Continuous monitoring and testing</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-success" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base-content">Access Controls</div>
                                                    <p className="text-sm">Role-based authorization system</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Cookies */}
                            <div id="cookies" ref={(el) => (sectionsRef.current[4] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Cookie className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Cookies & Tracking</h2>
                                            <p className="text-base-content/70">How we use cookies and similar technologies</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We use cookies for authentication, preferences, and analytics. You can control cookie settings through your browser, though this may limit platform functionality.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: User Rights */}
                            <div id="user-rights" ref={(el) => (sectionsRef.current[5] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                                            <Eye className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Your Rights</h2>
                                            <p className="text-base-content/70">Control over your personal data</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>You have the right to:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 bg-base-100 rounded-xl p-4 border border-base-300">
                                                <span className="text-2xl font-bold text-primary">1</span>
                                                <div>
                                                    <div className="font-bold text-base-content">Access Your Data</div>
                                                    <p className="text-sm">Request a copy of all personal information we hold</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-base-100 rounded-xl p-4 border border-base-300">
                                                <span className="text-2xl font-bold text-primary">2</span>
                                                <div>
                                                    <div className="font-bold text-base-content">Correct Inaccuracies</div>
                                                    <p className="text-sm">Update or correct any incorrect information</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-base-100 rounded-xl p-4 border border-base-300">
                                                <span className="text-2xl font-bold text-primary">3</span>
                                                <div>
                                                    <div className="font-bold text-base-content">Delete Your Account</div>
                                                    <p className="text-sm">Request complete account and data deletion</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-base-100 rounded-xl p-4 border border-base-300">
                                                <span className="text-2xl font-bold text-primary">4</span>
                                                <div>
                                                    <div className="font-bold text-base-content">Data Portability</div>
                                                    <p className="text-sm">Export your data in a structured format</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 7: Data Retention */}
                            <div id="data-retention" ref={(el) => (sectionsRef.current[6] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <Database className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Data Retention</h2>
                                            <p className="text-base-content/70">How long we keep your information</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We retain your data only as long as necessary for platform operations, legal compliance, and dispute resolution. Account data is deleted within 90 days of deletion request, except where required by law.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 8: Changes */}
                            <div id="changes" ref={(el) => (sectionsRef.current[7] = el)} className="scroll-mt-8">
                                <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="section-icon w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-info" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-base-content mb-2">Policy Changes</h2>
                                            <p className="text-base-content/70">How we notify you of updates</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-base-content/80 leading-relaxed">
                                        <p>We may update this policy periodically. Significant changes will be notified via email and platform notifications. Continued use after changes constitutes acceptance of the updated policy.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-base-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-base-content mb-2">Questions About Privacy?</h3>
                                        <p className="text-base-content/70 mb-4">If you have any concerns about how we handle your data, we're here to help.</p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300">
                                                Contact Privacy Team
                                            </button>
                                            <button className="btn btn-outline btn-primary shadow-lg hover:shadow-xl transition-all duration-300">
                                                Download Policy PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;
