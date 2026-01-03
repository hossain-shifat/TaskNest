import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
    const sectionRef = useRef(null);
    const faqRefs = useRef([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading animation
            gsap.from('.faq-heading', {
                scrollTrigger: {
                    trigger: '.faq-heading',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // FAQ items stagger animation
            faqRefs.current.forEach((faq, i) => {
                if (!faq) return;

                gsap.from(faq, {
                    scrollTrigger: {
                        trigger: faq,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    x: i % 2 === 0 ? -60 : 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: i * 0.08
                });
            });

            // Decorative elements
            gsap.from('.faq-decoration', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 180,
                opacity: 0,
                duration: 1.2,
                ease: 'back.out(1.7)',
                stagger: 0.15
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const toggleFAQ = (index) => {
        const faq = faqRefs.current[index];
        const answer = faq.querySelector('.faq-answer');
        const icon = faq.querySelector('.faq-icon');

        if (openIndex === index) {
            // Close
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
            setOpenIndex(null);
        } else {
            // Close previous
            if (openIndex !== null) {
                const prevAnswer = faqRefs.current[openIndex].querySelector('.faq-answer');
                const prevIcon = faqRefs.current[openIndex].querySelector('.faq-icon');
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

            // Open new
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
            setOpenIndex(index);
        }
    };

    const faqs = [
        {
            question: 'How do I start earning on the platform?',
            answer: 'Register as a Worker and receive 10 coins instantly. Browse available tasks from the TaskList, complete them according to buyer requirements, and submit your work. Once approved by the buyer, coins are credited to your account immediately.',
            category: 'Getting Started'
        },
        {
            question: 'What is the minimum withdrawal amount?',
            answer: 'Workers can withdraw when they reach 200 coins minimum, which equals $10. The conversion rate is 20 coins = $1. Multiple payment methods are supported including Stripe, Bkash, Rocket, and Nagad.',
            category: 'Withdrawals'
        },
        {
            question: 'How does the coin system work?',
            answer: 'Workers receive 10 coins on registration, Buyers get 50 coins. Buyers purchase coins (10 coins = $1) to pay for tasks. Workers earn coins by completing tasks and can withdraw at a rate of 20 coins = $1. This 2x conversion rate is how the platform generates revenue.',
            category: 'Coins & Payment'
        },
        {
            question: 'What happens if my submission is rejected?',
            answer: 'If a buyer rejects your submission, you will receive a notification explaining the reason. The task will become available again for other workers as the required_workers count increases by 1. You can attempt other tasks immediately.',
            category: 'Task Submissions'
        },
        {
            question: 'How do Buyers create and manage tasks?',
            answer: 'Buyers can create tasks by filling out a form with task details, required workers, payable amount, and deadline. The total cost (required_workers × payable_amount) is deducted from their coin balance. They can review submissions, approve or reject work, and manage their posted tasks from the dashboard.',
            category: 'For Buyers'
        },
        {
            question: 'Is my payment information secure?',
            answer: 'Yes. We implement role-based authorization, encrypted transactions, and secure payment processing through Stripe. All user data is protected with industry-standard security protocols. Your financial information is never stored on our servers.',
            category: 'Security'
        },
        {
            question: 'How long does task approval take?',
            answer: 'Task approval time depends on the buyer. You will receive real-time notifications when your submission is reviewed. Most tasks are reviewed within 24-48 hours. You can track all your submissions and their status from the My Submissions page.',
            category: 'Task Submissions'
        },
        {
            question: 'Can I change my role from Worker to Buyer?',
            answer: 'Yes. Platform admins have the ability to update user roles. Contact support if you need to switch between Worker, Buyer, or Admin roles. Your coin balance is preserved during role changes.',
            category: 'Account Management'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 px-4 bg-base-200 relative overflow-hidden rounded-2xl">
            {/* Decorative background elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl faq-decoration"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl faq-decoration"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/5 rounded-full blur-2xl faq-decoration"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16 faq-heading">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-info/10 rounded-full mb-4">
                        <HelpCircle className="w-4 h-4 text-info" />
                        <span className="text-info font-semibold text-sm uppercase tracking-wider">
                            FAQ
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Get answers to common questions about earning, withdrawals, and platform features.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            ref={(el) => (faqRefs.current[index] = el)}
                            className="bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-base-300 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-base-200 transition-colors duration-200"
                            >
                                <div className="flex-1">
                                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                                        {faq.category}
                                    </div>
                                    <h3 className="text-lg font-bold text-base-content pr-4">
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className="faq-icon shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ChevronDown className="w-5 h-5 text-primary" />
                                </div>
                            </button>

                            <div
                                className="faq-answer overflow-hidden"
                                style={{ height: 0 }}
                            >
                                <div className="px-6 pb-5">
                                    <div className="pt-4 border-t border-base-300">
                                        <p className="text-base-content leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact support CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-base-100 rounded-2xl p-8 shadow-lg border border-base-300">
                        <h3 className="text-xl font-bold text-base-content mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-base-content/70 mb-4">
                            Our support team is here to help you succeed on the platform.
                        </p>
                        <button className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
