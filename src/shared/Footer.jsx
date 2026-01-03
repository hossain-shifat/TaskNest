import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Facebook, Mail, MapPin, Phone } from "lucide-react";
import Logo from "../components/Logo";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerRef = useRef(null);
    const columnsRef = useRef([]);
    const socialRef = useRef([]);

    useEffect(() => {
        gsap.fromTo(
            footerRef.current,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            columnsRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            socialRef.current,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
            }
        );
    }, []);

    const socialLinks = [
        { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/yourprofile" },
        { name: "GitHub", icon: Github, url: "https://github.com/yourusername" },
        { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/yourprofile" },
        { name: "Email", icon: Mail, url: "mailto:your.email@example.com" },
    ];

    const quickLinks = [
        { name: "About Us", path: "/about" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "FAQs", path: "/faqs" },
        { name: "Contact", path: "/contact" },
    ];

    const forWorkers = [
        { name: "Browse Tasks", path: "/tasks" },
        { name: "My Earnings", path: "/dashboard/worker-home" },
        { name: "Withdraw Funds", path: "/dashboard/withdrawals" },
        { name: "Worker Guide", path: "/worker-guide" },
    ];

    const forBuyers = [
        { name: "Post a Task", path: "/dashboard/add-task" },
        { name: "My Tasks", path: "/dashboard/my-tasks" },
        { name: "Purchase Coins", path: "/dashboard/purchase-coin" },
        { name: "Buyer Guide", path: "/buyer-guide" },
    ];

    return (
        <footer ref={footerRef} className="bg-base-200 border-t border-base-300">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div ref={(el) => (columnsRef.current[0] = el)} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div>
                                <Logo/>
                            </div>
                        </div>
                        <p className="text-sm text-base-content/70 leading-relaxed max-w-xs">
                            The trusted platform connecting workers and businesses worldwide.
                        </p>

                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <MapPin className="w-4 h-4" />
                                <span>Gazipur, Dhaka, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <Phone className="w-4 h-4" />
                                <span>+880 1234-567890</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <Mail className="w-4 h-4" />
                                <span>support@microtaskpro.com</span>
                            </div>
                        </div>
                    </div>

                    <div ref={(el) => (columnsRef.current[1] = el)}>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((l, i) => (
                                <li key={i}>
                                    <a href={l.path} className="text-sm text-base-content/70 hover:text-accent">
                                        {l.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div ref={(el) => (columnsRef.current[2] = el)}>
                        <h4 className="text-lg font-bold mb-4">For Workers</h4>
                        <ul className="space-y-3">
                            {forWorkers.map((l, i) => (
                                <li key={i}>
                                    <a href={l.path} className="text-sm text-base-content/70 hover:text-accent">
                                        {l.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div ref={(el) => (columnsRef.current[3] = el)}>
                        <h4 className="text-lg font-bold mb-4">For Buyers</h4>
                        <ul className="space-y-3">
                            {forBuyers.map((l, i) => (
                                <li key={i}>
                                    <a href={l.path} className="text-sm text-base-content/70 hover:text-accent">
                                        {l.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-base-300">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-base-content/60">
                        © {currentYear} TaskNest. All rights reserved.
                    </p>

                    <div className="flex gap-3">
                        {socialLinks.map((social, i) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={i}
                                    ref={(el) => (socialRef.current[i] = el)}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-base-300 hover:bg-accent flex items-center justify-center"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
