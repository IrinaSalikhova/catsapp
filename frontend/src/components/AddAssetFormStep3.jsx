import React, { useState } from "react";

const AddAssetFormStep3 = ({ handleEmailEntered, handleSubmit, setStep }) => {


 const [createdEmail, setCreatedEmail] = useState("");

  const handleEmailChange = (e) => {

    setCreatedEmail(e.target.value);
    setTimeout(() => {
      handleEmailEntered(createdEmail); // Pass the email to the parent handler after the delay
    }, 500); // 500ms delay (0.5 seconds)
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    handleSubmit(e); 
    setStep(4);
  };

  return (
    <div className="form-grid">
      <label>
      Thank you for this information!<br></br> <br></br>
      If you want to receive a feedback about submitted information, please provide a email below
      </label>

      <div className="asset-form-field-container">
                    <label>
                      Email
                    </label>
                    <textarea
                      data-field="createdEmail"
                      placeholder="your_email@gmail.com"
                      maxLength="50"
                      value={createdEmail}
                      onChange={handleEmailChange}
                    />
                  </div>
      
      <button type="button" onClick={handleFormSubmit}>Proceed</button>
    </div>
  );
};

export default AddAssetFormStep3;
