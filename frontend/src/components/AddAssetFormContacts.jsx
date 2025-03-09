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
      if (prevFields.length > 0) {
        return prevFields.filter((_, idx) => idx !== fieldIndex);
      }
      return prevFields;
    });
  };


  const formatPhoneNumber = (input) => {
    const digits = input.replace(/\D/g, ""); // Remove non-numeric characters
    if (digits.length === 0) return "";
    let formatted = `(${digits.slice(0, 3)}`;
    if (digits.length > 3) formatted += `) ${digits.slice(3, 6)}`;
    if (digits.length > 6) formatted += `-${digits.slice(6, 10)}`;
    if (digits.length > 10) formatted += ` ext. ${digits.slice(10)}`;
    return formatted;
  };

  const handlePhoneChange = useCallback((e, fieldIndex) => {
    let value = e.target.value.replace(/\D/g, "");
    setPhoneFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });
    if (value.length >= 3) {
    handleChange(
      { target: { value, dataset: { field: "phoneNumber" } } }, 
      index, 
      fieldIndex
    );};
  }, [handleChange, index]);

  
  const handleEmailChange = useCallback((e, fieldIndex) => {
    const value = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    setEmailFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });

    if (isValid ) {
      handleChange(
        { target: { value, dataset: { field: "email" } } }, 
        index, 
        fieldIndex
      );
    }
  }, [handleChange, index]);

  const handleWebsiteChange = useCallback((e, fieldIndex) => {
    const value = e.target.value;
    const isValid = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);

    setWebsiteFields(prevFields => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = value;
      return newFields;
    });

    if (isValid) {
      handleChange(
        { target: { value, dataset: { field: "website" } } }, 
        index, 
        fieldIndex
      );
    }
  }, [handleChange, index]);

  return (
    <div className="contact-form-container">
      <div className="contact-field-group">
        <label className="contact-label">Phone Number</label>
        <div className="contact-fields">
          {phoneFields.map((phone, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <textarea
                className={`contact-input ${phone.length > 0 && phone.length < 3 || (phone.length > 5 && phone.length < 10) ? "invalid-input" : ""}`}
                placeholder="Please enter numbers only, including extension, without +1"
                maxLength="30"
                value={formatPhoneNumber(phone)}
                onChange={(e) => handlePhoneChange(e, fieldIndex)}
                rows="1"
              />
              <div className="contact-buttons">
                {phoneFields.length > 0 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, phoneFields, setPhoneFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {phoneFields.length < 3 && (
            <button type="button" className="contact-add-button" onClick={() => addField("phoneNumber", setPhoneFields)}>+</button>
          )}
        </div>
      </div>

      <div className="contact-field-group">
        <label className="contact-label">Email</label>
        <div className="contact-fields">
          {emailFields.map((email, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <textarea
                className="contact-input"
                placeholder="catsformap@gmail.com"
                maxLength="100"
                value={email}
                onChange={(e) => handleEmailChange(e, fieldIndex)}
                rows="1"
              />
              <div className="contact-buttons">
                {emailFields.length > 0 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, emailFields, setEmailFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {emailFields.length < 3 && (
            <button type="button" className="contact-add-button" onClick={() => addField("email", setEmailFields)}>+</button>
          )}
        </div>
      </div>

      <div className="contact-field-group">
        <label className="contact-label">Website</label>
        <div className="contact-fields">
          {websiteFields.map((website, fieldIndex) => (
            <div key={fieldIndex} className="contact-field-row">
              <textarea
                className="contact-input"
                placeholder="https://example.com"
                maxLength="100"
                value={website}
                onChange={(e) => handleWebsiteChange(e, fieldIndex)} 
                rows="1"
              />
              <div className="contact-buttons">
                {websiteFields.length > 0 && (
                  <button type="button" className="contact-remove-button" onClick={() => removeField(fieldIndex, websiteFields, setWebsiteFields)}>x</button>
                )}
              </div>
            </div>
          ))}
          {websiteFields.length < 3 && (
            <button type="button" className="contact-add-button" onClick={() => addField("website", setWebsiteFields)}>+</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAssetFormContacts;
