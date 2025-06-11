import React from 'react';
import './input.css';

interface InputProps {
    label: string;
    labelFor: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    label = '',
    labelFor = '',
    type = 'text',
    placeholder = '',
    value,
    onChange,
    className = '',
    disabled = false,
}) => {
    return (
       <div className="">
            <label className="text-white font-lg mb-2 block relative" htmlFor={labelFor}>
                {label}
            </label>
            <input
                className={`input ${className}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
       </div>
    );
};

export default Input; 