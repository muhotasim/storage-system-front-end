import React from 'react';

const Modal = ({onClose,title,children, show = false }) =>{
    return  <div className='modal modal-lg' style={{display: show?"block":"none"}}>
    <div className='modal-content fade-in'>
        <div className='modal-header'>
            {title&&<h2>{title}</h2 >}
            <span className='close' onClick={onClose}>&times;</span>
        </div>
        <div className='modal-body'>{children}</div>
    </div>
</div> 
}
export default Modal;