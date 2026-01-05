import React, { useEffect, useRef } from 'react'
import { Check, DollarSign, Lock, ShoppingCart, Sparkles, Zap } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import gsap from 'gsap'
import Swal from 'sweetalert2'

const PurchaseCoin = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const cardsRef = useRef([])
    const headerRef = useRef(null)
    const infoRef = useRef(null)

    const coinPackages = [
        {
            coins: 10,
            price: 1,
            popular: false,
            badge: 'Starter',
            gradient: 'from-blue-500/20 to-cyan-500/20',
            icon: '🎯'
        },
        {
            coins: 150,
            price: 10,
            popular: true,
            badge: 'Popular',
            gradient: 'from-purple-500/20 to-pink-500/20',
            icon: '⭐'
        },
        {
            coins: 500,
            price: 20,
            popular: false,
            badge: 'Pro',
            gradient: 'from-orange-500/20 to-red-500/20',
            icon: '🚀'
        },
        {
            coins: 1000,
            price: 35,
            popular: false,
            badge: 'Enterprise',
            gradient: 'from-emerald-500/20 to-teal-500/20',
            icon: '💎'
        }
    ]

    // useEffect(() => {
    //     // Header animation
    //     gsap.from(headerRef.current, {
    //         y: -30,
    //         opacity: 0,
    //         duration: 0.8,
    //         ease: 'power3.out'
    //     })

    //     // Cards animation
    //     gsap.from(cardsRef.current, {
    //         y: 50,
    //         opacity: 0,
    //         duration: 0.6,
    //         stagger: 0.15,
    //         delay: 0.3,
    //         ease: 'power3.out'
    //     })

    //     // Info animation
    //     gsap.from(infoRef.current, {
    //         y: 30,
    //         opacity: 0,
    //         duration: 0.6,
    //         delay: 0.8,
    //         ease: 'power3.out'
    //     })
    // }, [])

    const handlePurchase = async (pkg) => {
        try {
            const paymentInfo = {
                coin: pkg.coins,
                amount: pkg.price,
                buyerEmail: user.email
            }

            const res = await axiosSecure.post('/payment-checkout-session', paymentInfo)

            if (res.data.url) {
                window.location.href = res.data.url
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to initiate payment. Please try again.', 'error')
        }
    }

    return (
        <div className="space-y-12">
            {/* Page Header */}
            <div ref={headerRef} className="text-center space-y-4">
                <div className="inline-block">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <ShoppingCart className="text-primary-content" size={28} />
                        </div>
                    </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Purchase Coins
                </h1>
                <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                    Power up your tasks with our flexible coin packages. Choose the perfect plan for your needs.
                </p>
            </div>

            {/* Coin Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coinPackages.map((pkg, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardsRef.current[index] = el)}
                        className={`relative bg-gradient-to-br ${pkg.gradient} backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${pkg.popular
                                ? 'border-primary shadow-lg shadow-primary/20'
                                : 'border-base-300 hover:border-primary/50'
                            }`}
                    >
                        {/* Popular Badge */}
                        {pkg.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary blur-lg opacity-50"></div>
                                    <span className="relative badge badge-primary font-bold px-6 py-4 text-sm shadow-xl">
                                        <Sparkles size={14} className="mr-1" />
                                        {pkg.badge}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Card Content */}
                        <div className="space-y-6">
                            {/* Icon & Badge */}
                            <div className="text-center space-y-3 pt-2">
                                <div className="text-5xl">{pkg.icon}</div>
                                {!pkg.popular && (
                                    <span className="badge badge-ghost badge-sm">{pkg.badge}</span>
                                )}
                            </div>

                            {/* Coin Amount */}
                            <div className="text-center space-y-2">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-black bg-gradient-to-br from-accent to-warning bg-clip-text text-transparent">
                                        {pkg.coins}
                                    </span>
                                    <span className="text-xl font-semibold text-base-content/60">coins</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-center py-4 border-y border-base-300/50">
                                <div className="flex items-baseline justify-center gap-1">
                                    <DollarSign className="text-success" size={28} strokeWidth={3} />
                                    <span className="text-4xl font-black text-success">{pkg.price}</span>
                                </div>
                                <p className="text-xs text-base-content/50 mt-1">
                                    ${(pkg.price / pkg.coins).toFixed(3)} per coin
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-success" strokeWidth={3} />
                                    </div>
                                    <span className="font-medium">Instant delivery</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-success" strokeWidth={3} />
                                    </div>
                                    <span className="font-medium">Never expires</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-success" strokeWidth={3} />
                                    </div>
                                    <span className="font-medium">100% secure</span>
                                </li>
                            </ul>

                            {/* Purchase Button */}
                            <button
                                onClick={() => handlePurchase(pkg)}
                                className={`btn w-full gap-2 shadow-lg ${pkg.popular
                                        ? 'btn-primary hover:shadow-primary/50 hover:shadow-xl'
                                        : 'btn-outline btn-primary hover:btn-primary'
                                    }`}
                            >
                                <Zap size={18} />
                                Purchase Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Info Cards */}
            <div ref={infoRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Lock className="text-primary" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Secure Payment</h3>
                            <p className="text-sm text-base-content/70">
                                All transactions are encrypted and processed through Stripe's secure infrastructure
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="text-success" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Instant Delivery</h3>
                            <p className="text-sm text-base-content/70">
                                Coins are added to your account immediately after successful payment
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="text-info" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">24/7 Support</h3>
                            <p className="text-sm text-base-content/70">
                                Our support team is always ready to help with any payment issues
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-base-200 to-base-300 rounded-2xl p-8 shadow-md text-center">
                <p className="text-sm text-base-content/60 mb-3">Trusted by thousands of users</p>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                            <Check size={16} className="text-success" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                            <Check size={16} className="text-success" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium">PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                            <Check size={16} className="text-success" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium">Money Back Guarantee</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseCoin
