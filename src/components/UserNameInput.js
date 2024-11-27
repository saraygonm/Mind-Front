import React, { useState } from 'react';
import './UserNameInput.css';



const UserNameInput = ({ onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name);
        }
    };

    return (
        <div className="username-input-container">
            <h2 className="username-input-title">Enter Your Name</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="username-input-field"
            />
            <button onClick={handleSubmit} className="username-input-button">
                Submit
            </button>
        </div>
    );
};

export default UserNameInput;
