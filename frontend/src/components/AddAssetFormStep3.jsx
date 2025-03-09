import React, { useState } from "react";

const AddAssetFormStep3 = ({ handleEmailEntered, handleSubmit }) => {


 const [createdEmail, setCreatedEmail] = useState("");

  const handleEmailChange = (e) => {

    setCreatedEmail(e.target.value);
    setTimeout(() => {
      handleEmailEntered(createdEmail); // Pass the email to the parent handler after the delay
    }, 500); // 500ms delay (0.5 seconds)
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); 
    await handleSubmit(e); 
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
      
      <button type="button" 
      onClick={(e) => handleFormSubmit(e)}>
        Submit</button>
    </div>
  );
};

export default AddAssetFormStep3;
