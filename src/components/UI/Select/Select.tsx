import React from 'react';

import './select.css';

const Select = ({value, onChange, options, title}) => {

    return (    
        <select
            value={value} 
            onChange={onChange} 
            className="custom-select p-2"
        >
            <option value="">{title}</option>
            {options.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
            ))}
        </select>
    )
};  

export default Select;      