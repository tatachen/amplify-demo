import React from 'react'
import { Outlet } from 'react-router';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu'
import './MainContent.css';

const MainContent = props => {
    console.log(props);
    return (
        <div className="parent">
            <div className={(props.smallMenu ? 'small-side ' : '') + 'side-menu'}>
                <SideMenu smallMenu={props.smallMenu} />
            </div>
            <div className={(props.smallMenu ? 'small-content ' : '') + 'content-layout'}>
                <Header />
                {/* {props.children} */}
                <Outlet />
            </div>
        </div>
    )
}

export default MainContent
