import React from 'react';

import './btn.css';
const Btn = ({text, type, onClick, icon = false, children}) => {

    return (    
        <button className={`btn ${type}`} onClick={onClick}>
            {icon ? children : text}
        </button>
    )
};  

export default Btn;      