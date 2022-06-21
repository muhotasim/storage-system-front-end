import React from 'react';

const SectionHeader = ({ title, description }) =>{
    return <div className='section-header'>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
}
export default SectionHeader;