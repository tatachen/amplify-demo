import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import logo from '../../assets/images/elan.png';
import './TopMenu.css';

const TopMenu = ({toggleSideMenu}) => {
    return (
        <Menu fixed="top" className="top-menu">
            <Menu.Item className="menu-item">
                <div className="display-inline menu-logo">
                    <img src={logo} alt="logo"/>
                    <p>Elan</p>
                </div>
            </Menu.Item>
            <Menu.Item
                className="no-border"
                onClick={toggleSideMenu}>
                <Icon name="bars" />
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item position="right">
                    <div className="label-no-corner">
                        <span>Tata</span>
                    </div>
                </Menu.Item>
                <Menu.Item position="right">
                    <Icon name="sign out" />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default TopMenu
