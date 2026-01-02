import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'

const Root = () => {
    return (
        <div>
            <Navbar />
            <div className="bg-base-100 m-4 md:m-10 min-h-screen">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Root
