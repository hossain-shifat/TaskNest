import React, { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { MoonIcon, SunIcon, Menu, X, Github, Coins, LogOut, LayoutDashboard, Bell, Home } from 'lucide-react'
import { NavLink } from 'react-router'
import Logo from '../components/Logo'

const Navbar = () => {
    const { theme, toggleTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)

    // Auth state - Replace with your actual auth context/hook
    const isLoggedIn = true
    const user = {
        name: "John Doe",
        email: "john@example.com",
        role: "Worker",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        coins: 1250
    }

    // Notification count - Replace with actual notification logic
    const notificationCount = 3

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    const handleLogout = () => {
        // Implement your logout logic here
        console.log('Logout clicked')
        closeMenu()
    }

    // GitHub repository URL - Replace with your actual repo
    const githubRepoUrl = "https://github.com/yourusername/micro-task-platform"

    const links =
        <>
            <NavLink to='/'>
                <li className="flex items-center gap-2">
                    <Home className="size-5" />
                    <span className="text-md">Home</span>
                </li>
            </NavLink>
            <NavLink to='dashboard'>
                <li className="flex items-center gap-2">
                    <LayoutDashboard className="size-5" />
                    <span className="text-md">Dashboard</span>
                </li>
            </NavLink>
        </>

    return (
        <header className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* Left Section: Logo + Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Logo closeMenu={closeMenu} />
                        {/* Desktop Navigation - Not Logged In */}
                        {!isLoggedIn && (
                            <nav className="hidden lg:flex items-center gap-1">
                                <NavLink to="/" className="px-4 py-2 rounded-lg text-sm font-medium text-base-content/80 hover:text-base-content hover:bg-base-200/70 transition-all duration-200">Home</NavLink>
                                <NavLink to="/features" className="px-4 py-2 rounded-lg text-sm font-medium text-base-content/80 hover:text-base-content hover:bg-base-200/70 transition-all duration-200">Features</NavLink>
                                <NavLink to="/how-it-works" className="px-4 py-2 rounded-lg text-sm font-medium text-base-content/80 hover:text-base-content hover:bg-base-200/70 transition-all duration-200">How It Works</NavLink>
                            </nav>
                        )}

                        {/* Desktop Navigation - Logged In */}
                        {isLoggedIn && (
                            <nav className="hidden lg:flex items-center gap-1">
                                <ul className="flex gap-2 *:p-3">
                                    {links}
                                </ul>
                            </nav>
                        )}
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* Available Coins - Logged In Only */}
                        {isLoggedIn && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-accent/10 to-warning/10 border border-accent/20 rounded-lg hover:border-accent/40 transition-colors cursor-pointer group">
                                <div className="relative">
                                    <Coins className="size-5 text-accent group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:bg-accent/40 transition-colors"></div>
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs text-base-content/60 font-medium">Balance</span>
                                    <span className="text-sm font-bold text-accent">{user.coins.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Notifications - Logged In Only */}
                        {isLoggedIn && (
                            <div className="dropdown dropdown-end">
                                <button tabIndex={0} className="btn btn-square bg-transparent hover:bg-base-200 relative" onClick={() => setNotificationOpen(!notificationOpen)}>
                                    <Bell className="size-5 text-base-content" />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white animate-pulse">
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </button>
                                {notificationOpen && (
                                    <div tabIndex={0} className="dropdown-content z-10 mt-3 w-80 rounded-xl bg-base-100 shadow-xl border border-base-300" onClick={(e) => e.stopPropagation()}>
                                        <div className="px-4 py-3 border-b border-base-300">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-base">Notifications</h3>
                                                <span className="badge badge-primary badge-sm">{notificationCount} New</span>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {/* Sample Notifications - Replace with actual notification data */}
                                            <div className="px-4 py-3 hover:bg-base-200/50 cursor-pointer transition-colors border-b border-base-300">
                                                <p className="text-sm font-medium text-base-content">Task Approved!</p>
                                                <p className="text-xs text-base-content/60 mt-1">You earned 50 coins from completing "YouTube Video Comment"</p>
                                                <p className="text-xs text-primary mt-1">2 minutes ago</p>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-base-200/50 cursor-pointer transition-colors border-b border-base-300">
                                                <p className="text-sm font-medium text-base-content">New Task Available</p>
                                                <p className="text-xs text-base-content/60 mt-1">Check out the latest tasks in your dashboard</p>
                                                <p className="text-xs text-primary mt-1">1 hour ago</p>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-base-200/50 cursor-pointer transition-colors">
                                                <p className="text-sm font-medium text-base-content">Withdrawal Processed</p>
                                                <p className="text-xs text-base-content/60 mt-1">Your withdrawal of $25 has been approved</p>
                                                <p className="text-xs text-primary mt-1">3 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 border-t border-base-300">
                                            <button className="text-sm text-primary hover:text-primary/80 font-medium w-full text-center">
                                                View All Notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="btn btn-square bg-transparent hover:bg-base-200 transition-all duration-300" aria-label="Toggle theme">
                            <div className="relative w-5 h-5">
                                <SunIcon
                                    className={`size-5 absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                                        }`}
                                />
                                <MoonIcon
                                    className={`size-5 absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Auth Buttons - Not Logged In (Desktop) */}
                        {!isLoggedIn && (
                            <div className="hidden lg:flex items-center gap-2">
                                <NavLink to="/login" className="btn btn-primary btn-outline">
                                    Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-primary btn-outline">
                                    Register
                                </NavLink>
                            </div>
                        )}

                        {/* User Profile Dropdown - Logged In (Desktop) */}
                        {isLoggedIn && (
                            <div className="hidden lg:block dropdown dropdown-end">
                                <button tabIndex={0} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-all duration-200 group">
                                    <div className="flex flex-col items-end leading-none">
                                        <span className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-base-content/60 capitalize">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="avatar">
                                        <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 group-hover:ring-secondary transition-all">
                                            <img src={user.image} alt={user.name} />
                                        </div>
                                    </div>
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-10 menu p-2 mt-3 shadow-xl bg-base-100 rounded-xl w-64 border border-base-300">
                                    <li className="menu-title px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-12 rounded-full ring-2 ring-primary">
                                                    <img src={user.image} alt={user.name} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base text-base-content">{user.name}</span>
                                                <span className="text-xs text-base-content/60">{user.email}</span>
                                                <div className="badge badge-primary badge-sm mt-1 capitalize">{user.role}</div>
                                            </div>
                                        </div>
                                    </li>
                                    <div className="divider my-1"></div>
                                    <div>
                                        <li>
                                            <NavLink to="/profile" className="flex items-center gap-2 hover:bg-primary/10">
                                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Profile Settings</span>
                                            </NavLink>
                                        </li>
                                    </div>
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
                        <button onClick={toggleMenu} className="lg:hidden btn btn-square bg-transparent hover:bg-base-200" aria-label="Toggle menu">
                            <div className="relative w-6 h-6">
                                <Menu className={`size-6 absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
                                <X className={`size-6 absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden border-t border-base-300 bg-base-100 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="container mx-auto px-4 py-6 space-y-4">

                    {/* Mobile User Info - Logged In */}
                    {isLoggedIn && (
                        <div className="bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="avatar">
                                    <div className="w-14 rounded-full ring-2 ring-primary">
                                        <img src={user.image} alt={user.name} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-base">{user.name}</span>
                                    <span className="text-xs text-base-content/60">{user.email}</span>
                                    <div className="badge badge-primary badge-sm mt-1 capitalize">{user.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg">
                                <Coins className="size-5 text-accent" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs text-base-content/60">Available Coins</span>
                                    <span className="text-sm font-bold text-accent">{user.coins.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {!isLoggedIn && (
                        <nav className="space-y-1">
                            <NavLink to="/" className="block px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium" onClick={closeMenu}>Home</NavLink>
                            <NavLink to="/features" className="block px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium" onClick={closeMenu}>Features</NavLink>
                            <NavLink to="/how-it-works" className="block px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium" onClick={closeMenu}>How It Works</NavLink>
                            <div className="divider my-2"></div>
                            <NavLink to="/login" className="block" onClick={closeMenu}>
                                <button className="btn bg-primary w-full text-base-content font-bold">
                                    Login
                                </button>
                            </NavLink>
                            <NavLink to="/register" className="block" onClick={closeMenu}>
                                <button className="btn btn-primary w-full text-base-content font-bold">
                                    Register
                                </button>
                            </NavLink>
                        </nav>
                    )}
                    {isLoggedIn && (
                        <nav className="space-y-1">
                            <ul className="flex flex-col *:p-3 *:px-4">
                                {links}
                            </ul>
                            <NavLink to="/profile" className="block px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium" onClick={closeMenu}>Profile Settings</NavLink>
                            <div className="divider my-2"></div>
                            <button onClick={handleLogout} className="btn btn-error btn-outline w-full justify-start gap-2"><LogOut className="size-5" /> Logout</button>
                        </nav>
                    )}

                    <div className="pt-4 border-t border-base-300">
                        <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors" onClick={closeMenu}>
                            <Github className="size-5" />
                            <span className="font-medium">Join as Developer</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
