import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar'

export default function Layout() {
    return (
        <>
            <div className="flex h-screen text-white">
                <SideBar />
                <Outlet />
            </div>
        </>
    )
}
