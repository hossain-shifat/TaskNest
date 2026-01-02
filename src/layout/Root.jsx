import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../shared/Navbar'

const Root = () => {
    return (
        <div>
            <Navbar />
            <div className="bg-base-100 m-4 md:m-10">
                <Outlet />
            </div>
        </div>
    )
}

export default Root
