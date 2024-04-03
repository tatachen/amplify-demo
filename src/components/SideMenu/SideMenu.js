import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Item, Menu } from 'semantic-ui-react';
import TextIcon from '../TextIcon/TextIcon';

const menus = [
    {
        path: 'arduino',
        name: 'Arduino',
        icon: 'microchip'
    }
]

const SideMenu = ({ smallMenu }) => {

    const [activeMenu, setActiveMenu] = useState('users');

    const handleItemClick = (e, { name }) => {
        setActiveMenu(name);
    }

    return (
        <Menu fixed="left" borderless className={(smallMenu ? 'small-side ' : '') + 'side-menu'} vertical>
            {menus && menus.map(menu => (
                <Menu.Item as={Link} to={'/' + menu.path} key={menu.name} name={menu.name}
                    active={activeMenu === menu.name}
                    onClick={handleItemClick}>
                    <TextIcon hideText={smallMenu} color='teal' name={menu.icon}>
                        {menu.name}
                    </TextIcon>
                </Menu.Item>
            ))}
        </Menu>
    )
}

export default SideMenu
