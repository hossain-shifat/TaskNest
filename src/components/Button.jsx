import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Button - Reusable button component with animations
 *
 * Features:
 * - GSAP-powered hover animations
 * - Multiple variants (primary, secondary, outline, ghost)
 * - Loading state with spinner
 * - Icon support
 * - Disabled state handling
 * - Ripple effect on click
 *
 * Props:
 * @param {string} variant - Button style variant
 * @param {boolean} loading - Loading state
 * @param {boolean} disabled - Disabled state
 * @param {node} children - Button content
 * @param {node} icon - Optional icon
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler
 * @param {string} type - Button type (button, submit, reset)
 */
const Button = ({
    variant = 'primary',
    loading = false,
    disabled = false,
    children,
    icon = null,
    className = '',
    onClick,
    type = 'button',
    fullWidth = false
}) => {
    const btnRef = useRef(null);
    const rippleRef = useRef(null);

    // Hover animation
    useEffect(() => {
        if (!btnRef.current || loading || disabled) return;

        const btn = btnRef.current;

        const handleMouseEnter = () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mouseenter', handleMouseEnter);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [loading, disabled]);

    // Ripple effect on click
    const handleClick = (e) => {
        if (loading || disabled || !onClick) return;

        // Create ripple effect
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '0';
        ripple.style.height = '0';
        btn.appendChild(ripple);

        gsap.to(ripple, {
            width: 200,
            height: 200,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        });

        onClick(e);
    };

    // Variant classes
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        error: 'btn-error',
        success: 'btn-success',
        warning: 'btn-warning',
        info: 'btn-info'
    };

    return (
        <button
            ref={btnRef}
            type={type}
            onClick={handleClick}
            disabled={disabled || loading}
            className={`
        btn
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
        relative overflow-hidden
        transition-all duration-200
      `}
        >
            {loading ? (
                <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
