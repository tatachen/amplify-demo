import React from 'react';
import { Icon } from 'semantic-ui-react';
import './TextIcon.css';

const TextIcon = props => {
    return (
        <div className='text-icon'>
            <Icon size="large"
                color={props.color}
                name={props.name} />
            <div className='text-icon-label' hidden={props.hideText}>
                {props.children}
            </div>
        </div>
    )
}

export default TextIcon
