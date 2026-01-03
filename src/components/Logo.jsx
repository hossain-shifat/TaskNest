import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import logo from '../assets/logo.png'

const Logo = ({ closeMenu }) => {
    const logoRef = useRef(null)
    const iconRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
        // Create a timeline for coordinated animations
        const tl = gsap.timeline()

        // Animate logo icon (scale + rotation)
        tl.from(iconRef.current, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
        })

        // Animate text (fade & slide)
        tl.from(textRef.current, {
            opacity: 0,
            x: -20,
            duration: 0.5,
            ease: 'power2.out',
        }, '-=0.3') // Start 0.3s before icon animation ends

    }, [])

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, {
            scale: 1.08,
            rotate: 5,
            duration: 0.3,
            ease: 'power2.out',
        })
    }

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: 'power1.out',
        })
    }

    return (
        <div ref={logoRef}>
            <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Logo Icon */}
                <div
                    ref={iconRef}
                    className="p-2 rounded-lg border border-base-300 bg-base-100 shadow-sm"
                >
                    <img
                        src={logo}
                        alt="TaskNest Logo"
                        className="w-8 h-8 object-contain"
                    />
                </div>

                {/* Brand Text */}
                <div ref={textRef} className="flex flex-col leading-none">
                    <span className="text-xl font-semibold text-base-content tracking-tight">
                        TaskNest
                    </span>
                    <span className="text-[11px] text-base-content/60 font-medium tracking-widest uppercase">
                        Earn & Grow
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default Logo
