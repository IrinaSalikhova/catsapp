import React from 'react';
import '../assets/MessageModal.css';

const Modal = ({ message, onClose }) => {
    return (
        <div className="message-overlay">
            <div className="message-content">
                <p>{message}</p>
                <button onClick={onClose} className="message-button">Close</button>
            </div>
        </div>
    );
};

export default Modal;
