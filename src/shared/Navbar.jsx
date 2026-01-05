import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router'
import { Moon, Sun, Menu, X, Github, Coins, LogOut, LayoutDashboard, Home, Info, PhoneCall, HeartHandshake, HelpCircle, UserIcon, Briefcase, Shield } from 'lucide-react'
import Logo from '../components/Logo'
import NotificationDropdown from '../components/NotificationDropdown'
import { AuthContext } from '../context/Auth/AuthCOntext'
import useAuth from '../hooks/useAuth'
import useRole from '../hooks/useRole'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from '../hooks/useTheme'
import useAxiosSecure from '../hooks/useAxiosSecure'

const Navbar = () => {
    const { theme, toggleTheme } = useTheme()
    const { logOut } = useContext(AuthContext)
    const { user } = useAuth()
    const { role } = useRole()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const axiosSecure = useAxiosSecure()

    const githubRepoUrl = "https://github.com/hossain-shifat/TaskNest"

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    const isLoggedIn = !!user

    const handleLogout = async () => {
        try {
            await logOut()
            closeMenu()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const navigationLinks = {
        public: [
            { to: '/', label: 'Home', icon: Home },
            { to: '/about', label: 'About', icon: Info },
            { to: '/contact', label: 'Contact', icon: PhoneCall },
            { to: '/help', label: 'Help', icon: HelpCircle },
            { to: '/terms/privacy', label: 'Privacy', icon: HeartHandshake },
        ],
        worker: [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/about', label: 'About', icon: Info },
            { to: '/contact', label: 'Contact', icon: PhoneCall },
            { to: '/help', label: 'Help', icon: HelpCircle },
            { to: '/terms/privacy', label: 'Privacy', icon: Shield },
        ],
        buyer: [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/about', label: 'About', icon: Info },
            { to: '/contact', label: 'Contact', icon: PhoneCall },
            { to: '/help', label: 'Help', icon: HelpCircle },
            { to: '/terms/privacy', label: 'Privacy', icon: Shield },
        ],
        admin: [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/about', label: 'About', icon: Info },
            { to: '/contact', label: 'Contact', icon: PhoneCall },
            { to: '/help', label: 'Help', icon: HelpCircle },
            { to: '/terms/privacy', label: 'Privacy', icon: Shield },
        ]
    }

    const getCurrentLinks = () => {
        if (!isLoggedIn) return navigationLinks.public
        const userRole = role || 'worker'
        return navigationLinks[userRole] || navigationLinks.public
    }

    const currentLinks = getCurrentLinks()

    const { data: loggedInUser } = useQuery({
        queryKey: ['loggedInUser', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        }
    })

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-base-300 bg-base-100/95 backdrop-blur-md shadow-md">
                <div className="container mx-auto">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Left Section - Logo & Navigation */}
                        <div className="flex items-center gap-10">
                            <div>
                                <Logo closeMenu={closeMenu} />
                            </div>

                            <nav className="hidden lg:flex items-center gap-2">
                                {currentLinks.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                    ? 'active text-accent bg-accent/10'
                                                    : 'text-base-content hover:text-accent hover:bg-base-200/70'
                                                }`
                                            }
                                        >
                                            <Icon className="size-4" />
                                            <span>{link.label}</span>
                                        </NavLink>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Coin Balance - Desktop */}
                            {isLoggedIn && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/20 rounded-lg hover:border-accent/40 transition-all cursor-pointer group">
                                    <div className="relative">
                                        <Coins className="size-5 text-accent group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:bg-accent/40 transition-colors"></div>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xs text-base-content/60 font-medium">Balance</span>
                                        <span className="text-sm font-bold text-accent">{loggedInUser?.coin || 0}</span>
                                    </div>
                                </div>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-square btn-ghost transition-all duration-300"
                                aria-label="Toggle theme"
                            >
                                <div className="relative w-5 h-5">
                                    <Sun
                                        className={`size-5 absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                                            }`}
                                    />
                                    <Moon
                                        className={`size-5 absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            {/* GitHub Link */}
                            <a
                                href={githubRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:flex btn btn-square btn-ghost"
                                aria-label="Join as Developer"
                            >
                                <Github className="size-5" />
                            </a>

                            {/* Notification Dropdown - Only for logged-in users */}
                            {isLoggedIn && <NotificationDropdown />}

                            {/* Auth Buttons - Not logged in */}
                            {!isLoggedIn && (
                                <div className="hidden lg:flex items-center gap-2">
                                    <NavLink to="/login" className="btn btn-ghost">
                                        Login
                                    </NavLink>
                                    <NavLink to="/register" className="btn btn-primary">
                                        Register
                                    </NavLink>
                                </div>
                            )}

                            {/* User Menu - Desktop */}
                            {isLoggedIn && user && (
                                <div className="hidden lg:block dropdown dropdown-end">
                                    <button
                                        tabIndex={0}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-all duration-200 group"
                                        aria-label="User menu"
                                    >
                                        <div className="flex flex-col items-end leading-none">
                                            <span className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                                                {user.displayName || 'User'}
                                            </span>
                                            <span className="text-xs text-base-content/60 capitalize">{role || 'user'}</span>
                                        </div>
                                        <div className="avatar">
                                            <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 group-hover:ring-accent transition-all">
                                                <img
                                                    src={user.photoURL || 'https://via.placeholder.com/150'}
                                                    alt={user.displayName || 'User'}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-10 menu p-2 mt-3 shadow-xl bg-base-100 rounded-xl w-64 border border-base-300"
                                    >
                                        <li className="menu-title px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-12 rounded-full ring-2 ring-primary">
                                                        <img
                                                            src={user.photoURL || 'https://via.placeholder.com/150'}
                                                            alt={user.displayName || 'User'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-base text-base-content">{user.displayName || 'User'}</span>
                                                    <span className="text-xs text-base-content/60">{user.email}</span>
                                                    <div className="badge badge-primary badge-sm mt-1 capitalize">{role || 'user'}</div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li>
                                            <NavLink
                                                to="/profile"
                                                className="flex items-center gap-2 hover:bg-primary/10"
                                            >
                                                <UserIcon className="size-4" />
                                                <span>My Profile</span>
                                            </NavLink>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li>
                                            <button onClick={handleLogout} className="flex items-center gap-2 text-error hover:bg-error/10">
                                                <LogOut className="size-4" />
                                                <span>Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden btn btn-square btn-ghost"
                                aria-label="Toggle menu"
                            >
                                <div className="relative w-6 h-6">
                                    <Menu
                                        className={`size-6 absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                            }`}
                                    />
                                    <X
                                        className={`size-6 absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden border-t border-base-300 bg-base-100 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="container mx-auto px-4 py-6 space-y-4">
                        {/* User Profile Card - Mobile */}
                        {isLoggedIn && user && (
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="avatar">
                                        <div className="w-14 rounded-full ring-2 ring-primary">
                                            <img
                                                src={user.photoURL || 'https://via.placeholder.com/150'}
                                                alt={user.displayName || 'User'}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">{user.displayName || 'User'}</span>
                                        <span className="text-xs text-base-content/60">{user.email}</span>
                                        <div className="badge badge-primary badge-sm mt-1 capitalize">{role || 'user'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg">
                                    <Coins className="size-5 text-accent" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xs text-base-content/60">Available Coins</span>
                                        <span className="text-sm font-bold text-accent">{loggedInUser?.coin || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links - Mobile */}
                        <nav className="space-y-1">
                            {currentLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={closeMenu}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive
                                                ? 'bg-accent/10 text-accent'
                                                : 'text-base-content hover:bg-base-200'
                                            }`
                                        }
                                    >
                                        <Icon className="size-5" />
                                        <span>{link.label}</span>
                                    </NavLink>
                                )
                            })}
                        </nav>

                        {/* Auth Buttons - Mobile (Not logged in) */}
                        {!isLoggedIn && (
                            <>
                                <div className="divider my-2"></div>
                                <NavLink to="/login" onClick={closeMenu} className="block">
                                    <button className="btn btn-ghost w-full">Login</button>
                                </NavLink>
                                <NavLink to="/register" onClick={closeMenu} className="block">
                                    <button className="btn btn-primary w-full">Register</button>
                                </NavLink>
                            </>
                        )}

                        {/* User Actions - Mobile (Logged in) */}
                        {isLoggedIn && (
                            <>
                                <div className="divider my-2"></div>
                                <NavLink to="/profile" onClick={closeMenu} className="block">
                                    <button className="btn btn-ghost w-full justify-start gap-2">
                                        <UserIcon className="size-5" />
                                        My Profile
                                    </button>
                                </NavLink>
                                <button onClick={handleLogout} className="btn btn-error btn-outline w-full justify-start gap-2">
                                    <LogOut className="size-5" />
                                    Logout
                                </button>
                            </>
                        )}

                        {/* GitHub Link - Mobile */}
                        <div className="pt-4 border-t border-base-300">
                            <a
                                href={githubRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors"
                            >
                                <Github className="size-5" />
                                <span className="font-medium">Join as Developer</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    )
}

export default Navbar
