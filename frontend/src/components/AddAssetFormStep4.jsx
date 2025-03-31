import React from "react";

const AddAssetFormStep4 = ({onClose, resetForm, isNavigator, submissionStatus, setStep}) => {

  const handleClose = () => {
    resetForm(); 
    onClose(); 
  };

  return (
    <div className="form-grid">
      <label>
      {submissionStatus.success
          ? isNavigator
            ? "Thank you! New asset is successfully added to the system."
            : "Thank you for helping your community! Your information was sent for review!"
          : (
            <>
              An error occurred during submission. Please go back to previous steps and try again or contact us.
              <br />
              Error: {submissionStatus.message}
            </>
          )}
      </label>

      {submissionStatus.success ? (
        <button className='btn-primary' type="button" onClick={handleClose}>Close</button>
      ) : (
        <button className='btn-primary' type="button" onClick={() => setStep(2)}>Go back to form</button>
      )}
    </div>
  );
};

export default AddAssetFormStep4;
