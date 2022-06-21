import React from 'react';

const Header = ({ title, description }) =>{
    return <div className='header'>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
}
export default Header;