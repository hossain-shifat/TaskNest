import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../shared/Navbar'

const Root = () => {
    return (
        <div>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Root
