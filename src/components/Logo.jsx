import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import logo from '../assets/logo.png'

const Logo = ({ closeMenu }) => {
    const logoRef = useRef(null)
    const iconRef = useRef(null)
    const textRef = useRef(null)
    const [shouldAnimate, setShouldAnimate] = useState(false)
    const animationCompleted = useRef(false)

    useEffect(() => {
        // Check if animation should run (only once per session)
        const hasAnimatedThisSession = sessionStorage.getItem('logo-animated')

        if (!hasAnimatedThisSession && !animationCompleted.current) {
            // Wait for next frame to ensure DOM is ready
            requestAnimationFrame(() => {
                setShouldAnimate(true)
            })
        } else {
            // Already animated - ensure elements are visible immediately
            if (iconRef.current && textRef.current) {
                iconRef.current.style.opacity = '1'
                iconRef.current.style.visibility = 'visible'
                textRef.current.style.opacity = '1'
                textRef.current.style.visibility = 'visible'
            }
        }
    }, [])

    useEffect(() => {
        if (!shouldAnimate || animationCompleted.current) return
        if (!iconRef.current || !textRef.current) return

        animationCompleted.current = true
        sessionStorage.setItem('logo-animated', 'true')

        // Ensure elements are visible before animating
        gsap.set([iconRef.current, textRef.current], {
            visibility: 'visible',
            opacity: 1
        })

        // Create timeline
        const tl = gsap.timeline({
            defaults: {
                ease: 'power2.out'
            }
        })

        // Animate icon
        tl.fromTo(iconRef.current,
            {
                scale: 0,
                rotation: -180,
                opacity: 0
            },
            {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }
        )

        // Animate text
        tl.fromTo(textRef.current,
            {
                x: -20,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.5
            },
            '-=0.3'
        )

        return () => {
            tl.kill()
        }
    }, [shouldAnimate])

    const handleMouseEnter = () => {
        if (!iconRef.current) return

        gsap.to(iconRef.current, {
            scale: 1.08,
            rotate: 5,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        })
    }

    const handleMouseLeave = () => {
        if (!iconRef.current) return

        gsap.to(iconRef.current, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: 'power1.out',
            overwrite: 'auto'
        })
    }

    return (
        <div ref={logoRef}>
            <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-2 select-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Logo Icon */}
                <div
                    ref={iconRef}
                    className="p-2 rounded-lg border border-base-300 bg-base-100 shadow-sm"
                    style={{
                        opacity: shouldAnimate ? 0 : 1,
                        visibility: 'visible'
                    }}
                >
                    <img
                        src={logo}
                        alt="TaskNest Logo"
                        className="w-8 h-8 object-contain block"
                        loading="eager"
                        decoding="sync"
                        draggable="false"
                    />
                </div>

                {/* Brand Text */}
                <div
                    ref={textRef}
                    className="flex flex-col leading-none"
                    style={{
                        opacity: shouldAnimate ? 0 : 1,
                        visibility: 'visible'
                    }}
                >
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
