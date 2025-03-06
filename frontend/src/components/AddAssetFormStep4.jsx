import React from "react";

const AddAssetFormStep4 = ({onClose, resetForm}) => {

  const handleClose = () => {
    resetForm(); 
    onClose(); 
  };

  return (
    <div className="form-grid">
      <label>
      Thank you for helping your community! Your information was sent for review!
      </label>

      <button type="button" onClick={handleClose}>Close</button>
    </div>
  );
};

export default AddAssetFormStep4;
