import React, { useState, useCallback } from "react";

const AddAssetFormContacts = ({ handleChange, service, index, setFormData }) => {
  const [phoneFields, setPhoneFields] = useState(service.phoneNumber || [""]);
  const [emailFields, setEmailFields] = useState(service.email || [""]);
  const [websiteFields, setWebsiteFields] = useState(service.website || [""]);

  const addField = (field, setFields) => {
    setFields(prevFields => {
      if (prevFields.length < 5) {
        return [...prevFields, ""];
      }
      return prevFields;
    });
  };

  const removeField = (fieldIndex, fields, setFields) => {
    setFields(prevFields => {
      if (prevFields.length > 1) {
        return prevFields.filter((_, idx) => idx !== fieldIndex);
      }
      return prevFields;
    });
  };

  const handlePhoneChange = useCallback((e, fieldIndex) => {
    // Allow only numbers in the phone number input
    const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setPhoneFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });

    handleChange({
      target: {
        value,
        dataset: { field: "phoneNumber" },
      }
    }, index, fieldIndex);
  }, [handleChange, index]);

  const handleEmailChange = useCallback((e, fieldIndex) => {
    const value = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";

    // Update email fields regardless of validation for better UX
    setEmailFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });

    // Only trigger handleChange for valid values
    if (isValid || value === "") {
      handleChange({
        target: {
          value,
          dataset: { field: "email" },
        }
      }, index, fieldIndex);
    }
  }, [handleChange, index]);

  const handleWebsiteChange = useCallback((e, fieldIndex) => {
    const value = e.target.value;
    const isValid = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value) || value === "";

    // Update website fields regardless of validation for better UX
    setWebsiteFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });

    // Only trigger handleChange for valid values
    if (isValid || value === "") {
      handleChange({
        target: {
          value,
          dataset: { field: "website" },
        }
      }, index, fieldIndex);
    }
  }, [handleChange, index]);

  return (
    <div className="contact-form-container">
      <div className="contact-field-group">
        <label className="contact-label">Phone Number</label>
        <div className="contact-fields">
          {phoneFields.map((phone, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <input
                type="text"
                className="contact-input"
                placeholder="(123) 456-7890"
                maxLength="9"
                value={phone}
                onChange={(e) => handlePhoneChange(e, fieldIndex)} // Now this is defined to allow only numbers
              />
              <div className="contact-buttons">
                {phoneFields.length > 1 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, phoneFields, setPhoneFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {phoneFields.length < 5 && (
            <button type="button" className="contact-add-button" onClick={() => addField("phoneNumber", setPhoneFields)}>+</button>
          )}
        </div>
      </div>

      <div className="contact-field-group">
        <label className="contact-label">Email</label>
        <div className="contact-fields">
          {emailFields.map((email, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <input
                type="text"
                className="contact-input"
                placeholder="catsformap@gmail.com"
                maxLength="100"
                value={email}
                onChange={(e) => handleEmailChange(e, fieldIndex)} // Email validation and value update
              />
              <div className="contact-buttons">
                {emailFields.length > 1 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, emailFields, setEmailFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {emailFields.length < 5 && (
            <button type="button" className="contact-add-button" onClick={() => addField("email", setEmailFields)}>+</button>
          )}
        </div>
      </div>

      <div className="contact-field-group">
        <label className="contact-label">Website</label>
        <div className="contact-fields">
          {websiteFields.map((website, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <input
                type="text"
                className="contact-input"
                placeholder="https://example.com"
                maxLength="100"
                value={website}
                onChange={(e) => handleWebsiteChange(e, fieldIndex)} // Website validation and value update
              />
              <div className="contact-buttons">
                {websiteFields.length > 1 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, websiteFields, setWebsiteFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {websiteFields.length < 5 && (
            <button type="button" className="contact-add-button" onClick={() => addField("website", setWebsiteFields)}>+</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAssetFormContacts;
