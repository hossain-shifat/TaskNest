import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    CheckCircle,
    Facebook,
    Twitter,
    Linkedin,
    Github,
    Instagram
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const heroRef = useRef(null);
    const formRef = useRef(null);
    const contactCardsRef = useRef([]);
    const socialRef = useRef([]);
    const mapRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            const heroTl = gsap.timeline();
            heroTl
                .from('.contact-badge', {
                    scale: 0,
                    rotation: -180,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(2)'
                })
                .from('.contact-title', {
                    y: 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power3.out'
                }, '-=0.4')
                .from('.contact-subtitle', {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.5');

            // Contact cards animation
            contactCardsRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 80,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.7,
                    ease: 'back.out(1.7)',
                    delay: i * 0.1
                });

                // Icon animation
                gsap.from(card.querySelector('.contact-icon'), {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    rotation: 360,
                    scale: 0,
                    duration: 0.8,
                    ease: 'back.out(2)',
                    delay: i * 0.1 + 0.3
                });

                // Hover effect
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(card.querySelector('.contact-icon'), {
                        scale: 1.15,
                        rotation: 10,
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
                    gsap.to(card.querySelector('.contact-icon'), {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // Form animation
            gsap.from('.form-container', {
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Form fields stagger
            gsap.from('.form-field', {
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });

            // Map animation
            gsap.from('.map-container', {
                scrollTrigger: {
                    trigger: mapRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Social icons animation
            socialRef.current.forEach((icon, i) => {
                if (!icon) return;

                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: '.social-section',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0,
                    rotation: 180,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    delay: i * 0.08
                });

                // Hover animation
                icon.addEventListener('mouseenter', () => {
                    gsap.to(icon, {
                        scale: 1.2,
                        rotation: 360,
                        duration: 0.5,
                        ease: 'back.out(2)'
                    });
                });

                icon.addEventListener('mouseleave', () => {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // Floating background elements
            gsap.to('.float-element', {
                y: -30,
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.5
            });

            // Pulse animation
            gsap.to('.pulse-element', {
                scale: 1.1,
                opacity: 0.8,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });

        });

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Animate button
        gsap.to('.submit-button', {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Success animation
            gsap.from('.success-message', {
                scale: 0,
                rotation: 180,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(2)'
            });

            // Reset form
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 3000);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            content: 'support@microtask.com',
            description: 'Get response within 24 hours',
            color: 'primary'
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: '+1 (555) 123-4567',
            description: 'Mon-Fri, 9AM-6PM EST',
            color: 'secondary'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            content: '123 Tech Street, Silicon Valley',
            description: 'CA 94025, United States',
            color: 'accent'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: 'Monday - Friday',
            description: '9:00 AM - 6:00 PM EST',
            color: 'info'
        }
    ];

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', color: 'from-blue-500 to-blue-600' },
        { icon: Twitter, label: 'Twitter', color: 'from-sky-400 to-sky-500' },
        { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-600 to-blue-700' },
        { icon: Github, label: 'GitHub', color: 'from-gray-700 to-gray-800' },
        { icon: Instagram, label: 'Instagram', color: 'from-pink-500 to-purple-500' }
    ];

    return (
        <div className="min-h-screen bg-base-100 space-y-10 *:rounded-2xl">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-base-100 to-base-200">
                <div className="float-element absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="float-element absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="pulse-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="contact-badge inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
                    </div>
                    <h1 className="contact-title text-5xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6">
                        Let's Start a
                        <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Conversation
                        </span>
                    </h1>
                    <p className="contact-subtitle text-xl text-base-content/70 max-w-2xl mx-auto">
                        Have questions about our platform? Need support? Want to partner with us? We're here to help and would love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 px-4 bg-base-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, i) => {
                            const Icon = info.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (contactCardsRef.current[i] = el)}
                                    className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-lg cursor-pointer"
                                >
                                    <div className={`contact-icon w-14 h-14 rounded-xl bg-${info.color}/10 flex items-center justify-center mb-4`}>
                                        <Icon className={`w-7 h-7 text-${info.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-base-content mb-2">{info.title}</h3>
                                    <p className="text-base-content font-semibold mb-1">{info.content}</p>
                                    <p className="text-sm text-base-content/60">{info.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Form and Map Section */}
            <section ref={formRef} className="bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="form-container">
                            <div className="bg-base-200 rounded-3xl p-8 md:p-10 border border-base-300 shadow-xl">
                                <div className="mb-8">
                                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-3">Send us a Message</h2>
                                    <p className="text-base-content/70">Fill out the form below and we'll get back to you as soon as possible.</p>
                                </div>

                                {isSuccess ? (
                                    <div className="success-message flex flex-col items-center justify-center py-12">
                                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle className="w-10 h-10 text-success" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-base-content mb-2">Message Sent!</h3>
                                        <p className="text-base-content/70 text-center">Thank you for contacting us. We'll respond within 24 hours.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="form-field">
                                            <label className="block text-sm font-semibold text-base-content mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="block text-sm font-semibold text-base-content mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="block text-sm font-semibold text-base-content mb-2">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="block text-sm font-semibold text-base-content mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="5"
                                                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            ></textarea>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="submit-button w-full btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Message
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map and Additional Info */}
                        <div ref={mapRef} className="space-y-8">
                            <div className="map-container">
                                <div className="bg-base-200 rounded-3xl overflow-hidden border border-base-300 shadow-xl h-100">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6282213127247!2d-122.08624908469343!3d37.42199997982517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1635959220751!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            </div>

                            <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-base-300">
                                <h3 className="text-2xl font-bold text-base-content mb-4">Why Contact Us?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span className="text-base-content/80">Quick response within 24 hours</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span className="text-base-content/80">Dedicated support team available</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span className="text-base-content/80">Multiple channels to reach us</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span className="text-base-content/80">Partnership and business inquiries welcome</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="social-section py-20 px-4 bg-base-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Connect With Us</h2>
                    <p className="text-lg text-base-content/70 mb-10">
                        Follow us on social media for updates, tips, and community highlights.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {socialLinks.map((social, i) => {
                            const Icon = social.icon;
                            return (
                                <button
                                    key={i}
                                    ref={(el) => (socialRef.current[i] = el)}
                                    className={`w-16 h-16 rounded-full bg-linear-to-br ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                                    aria-label={social.label}
                                >
                                    <Icon className="w-7 h-7" />
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-12 inline-block bg-base-100 rounded-2xl p-8 shadow-lg border border-base-300">
                        <p className="text-base-content/70 mb-4">
                            Looking for immediate help? Check out our{' '}
                            <span className="text-primary font-semibold hover:underline cursor-pointer">Help Center</span>
                            {' '}or browse our{' '}
                            <span className="text-primary font-semibold hover:underline cursor-pointer">FAQ</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
