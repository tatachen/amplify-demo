import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';
import './Header.css';

const Header = props => {
    let location = useLocation();
    let pathname = location.pathname;
    const pathnames = pathname.split('/').filter(x => x);
    console.log(pathnames)


    const getBreadcrumbs = () => {
        let content = [];
        pathnames && pathnames.map((path, idx) => {
            const routeTo = `/${pathnames.slice(0, idx + 1).join("/")}`;
            console.log(routeTo)
            const isLast = idx === pathnames.length - 1;
            console.log(isLast);
            if (isLast) {
                content.push(<Breadcrumb.Section key={"section_" + idx} active>{path}</Breadcrumb.Section>);
            } else {
                content.push(<Breadcrumb.Section key={"section_" + idx} as={Link} to={routeTo} link>{path}</Breadcrumb.Section>);
                content.push(<Breadcrumb.Divider key={"divider_" + idx} icon='right chevron' />);
            }
        })
        return content;
    }

    return (
        <div className="header-content">
            <div className="sub-header">
                <Breadcrumb>
                    {getBreadcrumbs()}
                </Breadcrumb>
            </div>
        </div>
    )
}

export default Header
