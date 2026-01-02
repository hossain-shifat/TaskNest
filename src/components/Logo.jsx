import React from 'react'
import { Link } from 'react-router'
import logo from '../assets/logo.png'

const Logo = ({ closeMenu }) => {
    return (
        <div>
            <Link to="/" className="flex items-center gap-1 group" onClick={closeMenu}>
                <div className="relative">
                    <div className="absolute inset-0 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative p-2.5 rounded-xl group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        <img src={logo} className="w-8 h-8" alt="" />
                    </div>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-bold bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        TaskNest
                    </span>
                    <span className="text-[10px] text-base-content/60 font-medium tracking-wider uppercase">
                        Earn & Grow
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default Logo
