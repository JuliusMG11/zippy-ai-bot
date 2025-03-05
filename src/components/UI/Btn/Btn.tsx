import React from 'react';

import './btn.css';

const Btn = ({text, type}) => {

    return (    
        <button className={`btn ${type}`}>
            {text}
        </button>
    )
};  

export default Btn;      