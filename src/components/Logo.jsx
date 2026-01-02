import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import logo from '../assets/logo.png'

const Logo = ({ closeMenu }) => {
    const logoRef = useRef(null)
    const iconRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(
            logoRef.current,
            { opacity: 0, y: -8 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            }
        )
    }, [])

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, {
            scale: 1.08,
            rotate: 2,
            duration: 0.3,
            ease: 'power2.out',
        })
    }

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: 'power2.out',
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
                <div className="flex flex-col leading-none">
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
