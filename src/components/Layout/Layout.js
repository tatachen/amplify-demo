import React, { useState } from 'react'
import { Outlet } from 'react-router';
import MainContent from '../MainContent/MainContent';
import TopMenu from '../TopMenu/TopMenu'
import './Layout.css'

const Layout = () => {
    const [smallMenu, setSmallMenu] = useState(false);

    const toggleSideMenu = () => {
        setSmallMenu(!smallMenu)
    }

    return (
        <div className="grid">
            <div className="menu">
                <TopMenu toggleSideMenu={toggleSideMenu}/>
            </div>
            <div className="main-content">
                <MainContent smallMenu={smallMenu}>
                    <Outlet />
                </MainContent>
            </div>
        </div>
    )
}

export default Layout
