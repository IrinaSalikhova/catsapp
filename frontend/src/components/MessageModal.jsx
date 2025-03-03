import React from 'react';
import '../assets/MessageModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="button-confirm">Confirm</button>
                    <button onClick={onCancel} className="button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
