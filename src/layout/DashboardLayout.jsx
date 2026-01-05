import { Bell, CircleDollarSign, Home, ListCheck, PanelRightClose, Plus, ShoppingCart, User, Users, Wallet, LogOut, Settings, UserCircle, Search, Command, X } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router'
import Logo from '../components/Logo'
import LogoImg from '../assets/logo.png'
import NotificationDropdown from '../components/NotificationDropdown'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/UseAxiosSecure'
import useAuth from '../hooks/useAuth'
import useRole from '../hooks/useRole'

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [activeMenu, setActiveMenu] = useState('/dashboard')
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const { user, logOut } = useAuth()
    const { role } = useRole()
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const location = useLocation()
    const searchInputRef = useRef(null)

    const { data: userData } = useQuery({
        queryKey: ['user-data', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        },
        enabled: !!user?.email
    })

    const handleDrawerToggle = () => {
        if (window.innerWidth >= 1024) {
            setIsCollapsed(prev => !prev)
        }
    }

    const handleLogout = async () => {
        try {
            await logOut()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Update active menu and breadcrumbs on route change
    useEffect(() => {
        const path = location.pathname
        setActiveMenu(path)

        // Generate breadcrumbs
        const pathSegments = path.split('/').filter(Boolean)
        const crumbs = pathSegments.map((segment, index) => {
            const url = '/' + pathSegments.slice(0, index + 1).join('/')
            const label = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            return { label, url }
        })
        setBreadcrumbs(crumbs)
    }, [location.pathname])

    // Keyboard shortcut for search (Ctrl/Cmd + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setSearchOpen(true)
            }
            if (e.key === 'Escape' && searchOpen) {
                setSearchOpen(false)
                setSearchQuery('')
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [searchOpen])

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [searchOpen])

    // Worker Navigation
    const workerNav = [
        { path: '/dashboard', icon: Home, label: 'Home', keywords: ['home', 'dashboard', 'overview'] },
        { path: '/dashboard/task-list', icon: ListCheck, label: 'Task List', keywords: ['tasks', 'jobs', 'work', 'browse'] },
        { path: '/dashboard/my-submissions', icon: ListCheck, label: 'My Submissions', keywords: ['submissions', 'history', 'completed'] },
        { path: '/dashboard/withdrawals', icon: Wallet, label: 'Withdrawals', keywords: ['withdraw', 'money', 'payment', 'cash out'] }
    ]

    // Buyer Navigation
    const buyerNav = [
        { path: '/dashboard', icon: Home, label: 'Home', keywords: ['home', 'dashboard', 'overview'] },
        { path: '/dashboard/add-task', icon: Plus, label: 'Add New Task', keywords: ['create', 'add', 'new', 'post task'] },
        { path: '/dashboard/my-tasks', icon: ListCheck, label: 'My Tasks', keywords: ['tasks', 'posted', 'my jobs'] },
        { path: '/dashboard/purchase-coin', icon: ShoppingCart, label: 'Purchase Coin', keywords: ['buy', 'coins', 'purchase', 'top up'] },
        { path: '/dashboard/payment-history', icon: CircleDollarSign, label: 'Payment History', keywords: ['payments', 'transactions', 'history'] }
    ]

    // Admin Navigation
    const adminNav = [
        { path: '/dashboard', icon: Home, label: 'Home', keywords: ['home', 'dashboard', 'overview'] },
        { path: '/dashboard/manage-users', icon: Users, label: 'Manage Users', keywords: ['users', 'members', 'accounts'] },
        { path: '/dashboard/manage-tasks', icon: ListCheck, label: 'Manage Tasks', keywords: ['tasks', 'jobs', 'moderation'] }
    ]

    const getNavigation = () => {
        if (role === 'admin') return adminNav
        if (role === 'buyer') return buyerNav
        return workerNav
    }

    const navigation = getNavigation()

    // Search functionality
    const filteredNavigation = navigation.filter(item => {
        const query = searchQuery.toLowerCase()
        return (
            item.label.toLowerCase().includes(query) ||
            item.keywords?.some(keyword => keyword.includes(query))
        )
    })

    const handleSearchSelect = (path) => {
        navigate(path)
        setSearchOpen(false)
        setSearchQuery('')
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            {/* PAGE CONTENT */}
            <div className="drawer-content">
                <nav className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-40 shadow-sm">
                    <div className="flex-1 flex items-center gap-3">
                        <label
                            htmlFor="my-drawer-4"
                            onClick={handleDrawerToggle}
                            className="btn btn-square hover:bg-base-200 bg-transparent border-none shadow-none"
                        >
                            <PanelRightClose className={`${isCollapsed ? "rotate-180" : ""} transition-transform duration-300`} />
                        </label>

                        {/* Breadcrumbs - Desktop Only */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.url}>
                                    {index > 0 && <span className="text-base-content/40">/</span>}
                                    <Link
                                        to={crumb.url}
                                        className={`hover:text-primary transition-colors ${index === breadcrumbs.length - 1
                                            ? 'text-base-content font-semibold'
                                            : 'text-base-content/60'
                                            }`}
                                    >
                                        {crumb.label}
                                    </Link>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex-none flex gap-2 items-center">
                        {/* Quick Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-base-300 hover:border-primary/50 hover:bg-base-200 transition-all group"
                        >
                            <Search size={16} className="text-base-content/60 group-hover:text-primary transition-colors" />
                            <span className="text-sm text-base-content/60 group-hover:text-base-content">Quick search...</span>
                            <kbd className="kbd kbd-xs">⌘K</kbd>
                        </button>

                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="lg:hidden btn btn-square btn-ghost"
                        >
                            <Search size={20} />
                        </button>

                        {/* Available Coins */}
                        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/20 px-4 py-2 rounded-lg hover:border-accent/40 hover:shadow-lg transition-all group cursor-pointer">
                            <div className="relative">
                                <CircleDollarSign className="text-accent group-hover:scale-110 transition-transform" size={20} />
                                <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm group-hover:bg-accent/40 transition-colors"></div>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-base-content/60 font-medium">Balance</span>
                                <span className="font-bold text-accent text-sm">{userData?.coin || 0}</span>
                            </div>
                        </div>

                        {/* Notification */}
                        <NotificationDropdown />

                        {/* User Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-base-200 transition-all duration-200 group"
                                aria-label="User menu"
                            >
                                <div className="hidden lg:flex flex-col items-end leading-none">
                                    <span className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                                        {user?.displayName}
                                    </span>
                                    <span className="text-xs text-base-content/60 capitalize badge badge-sm badge-outline mt-0.5">
                                        {role}
                                    </span>
                                </div>
                                <div className="avatar">
                                    <div className="w-9 sm:w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 group-hover:ring-accent transition-all">
                                        <img
                                            src={user?.photoURL}
                                            alt={user?.displayName}
                                        />
                                    </div>
                                </div>
                            </button>

                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[100] menu mt-3 p-0 shadow-xl bg-base-100 rounded-xl w-72 border border-base-300 overflow-hidden"
                            >
                                {/* Profile Header */}
                                <li className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-base-300">
                                    <div className="px-4 py-4 cursor-default hover:bg-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-12 rounded-full ring-2 ring-primary">
                                                    <img
                                                        src={user?.photoURL}
                                                        alt={user?.displayName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="font-bold text-base text-base-content truncate">
                                                    {user?.displayName}
                                                </span>
                                                <span className="text-xs text-base-content/60 truncate">
                                                    {user?.email}
                                                </span>
                                                <div className="badge badge-primary badge-sm mt-1.5 capitalize">
                                                    {role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Coins Display - Mobile Only */}
                                <li className="sm:hidden border-b border-base-300">
                                    <div className="px-4 py-3 cursor-default hover:bg-transparent">
                                        <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                                            <CircleDollarSign className="text-accent" size={18} />
                                            <div className="flex flex-col leading-none">
                                                <span className="text-[10px] text-base-content/60">Available Coins</span>
                                                <span className="text-sm font-bold text-accent">{userData?.coin || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <li>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <UserCircle className="text-primary" size={18} />
                                            </div>
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium text-sm">My Profile</span>
                                                <span className="text-xs text-base-content/60">View and edit profile</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-info/10 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                                                <Settings className="text-info" size={18} />
                                            </div>
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium text-sm">Settings</span>
                                                <span className="text-xs text-base-content/60">Preferences & settings</span>
                                            </div>
                                        </Link>
                                    </li>
                                </div>

                                {/* Logout Button */}
                                <li className="border-t border-base-300">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-error/10 transition-colors text-error"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                                            <LogOut size={18} />
                                        </div>
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-medium text-sm">Logout</span>
                                            <span className="text-xs text-error/60">Sign out of your account</span>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="m-3 md:m-5 p-5 md:p-10 rounded-2xl min-h-screen bg-base-100">
                    <Outlet />
                </div>
            </div>

            {/* SIDEBAR */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <div className={`min-h-full bg-base-200 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
                    <ul className="menu w-full *:text-base-content">
                        {/* Logo */}
                        <div className="mb-5 border-b border-base-300 pb-4">
                            {!isCollapsed ? (
                                <div className="flex justify-start py-2 px-4">
                                    <Logo />
                                </div>
                            ) : (
                                <Link to='/' className="flex justify-center items-center p-2 rounded-lg border border-base-300 bg-base-100 shadow-sm">
                                    <img src={LogoImg} alt="TaskNest Logo"
                                        className="w-8 h-8 object-contain block"
                                        loading="eager"
                                        decoding="sync"
                                        draggable="false" />
                                </Link>
                            )}
                        </div>

                        {/* Navigation Links */}
                        {navigation.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => setActiveMenu(item.path)}
                                    className={`${activeMenu === item.path ? 'nav-active' : ''
                                        } ${isCollapsed ? 'flex justify-center items-center' : ''}`}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Command Palette / Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl mx-4 bg-base-100 rounded-xl shadow-2xl border border-base-300 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-base-300">
                            <Search size={20} className="text-base-content/60" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search pages..."
                                className="flex-1 bg-transparent outline-none text-base"
                            />
                            <button
                                onClick={() => {
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                }}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-96 overflow-y-auto">
                            {searchQuery.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <Command size={48} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">Type to search pages...</p>
                                    <p className="text-xs mt-2">Press ESC to close</p>
                                </div>
                            ) : filteredNavigation.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <p className="text-sm">No results found for "{searchQuery}"</p>
                                </div>
                            ) : (
                                <ul className="py-2">
                                    {filteredNavigation.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <li key={item.path}>
                                                <button
                                                    onClick={() => handleSearchSelect(item.path)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Icon className="text-primary" size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.label}</p>
                                                        <p className="text-xs text-base-content/60">{item.path}</p>
                                                    </div>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Footer Tips */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-base-300 bg-base-200 text-xs text-base-content/60">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="kbd kbd-xs">↑↓</kbd> Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="kbd kbd-xs">↵</kbd> Select
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <kbd className="kbd kbd-xs">ESC</kbd> Close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout
