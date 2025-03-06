import React, { useState, useEffect } from "react";
import requiredIcon from "/required.png";
import CategoryDropdown from "./CategoryDropdown";
import AddAssetFormLocation from "./AddAssetFormLocation";
import AddAssetFormContacts from "./AddAssetFormContacts";

const AddAssetFormStep2 = ({
  formData,
  handleChange,
  handleCategorySelect,
  assetType,
  handleAddService,
  allFormsValid,
  setFormData,
  resetForm,
  setStep,
  handleRemoveLastService
}) => {

  const [showLocation, setShowLocation] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // useEffect(() => {
  //   if (assetType.physical) {
  //     setShowLocation(true);
  //     setShowContact(false);
  //   } else {
  //     setShowLocation(false);
  //     setShowContact(true);
  //   }
  // }, [assetType.physical]);


  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to remove all entered data?")) {
      resetForm();
    }
  };


  return (
    <div className="form-grid">
      {formData.map((service, index) => (
        
        <div key={index} className="service-section">

          <div className="asset-form-field-container">
            <label>
              Resource Name
              <img src={requiredIcon} alt="Required" className="required-icon" />
            </label>
            <textarea
              data-field="name"
              placeholder="ex. Carlington Community Health Centre"
              maxLength="250"
              required
              value={service.name}
              onChange={(e) => handleChange(e, index)}
            />
            <div className="character-count">{250 - service.name.length}/250</div>
          </div>

          <div className="asset-form-field-container">
            <CategoryDropdown onCategorySelect={(categories, event) => handleCategorySelect(categories, index, event)} />
            <img src={requiredIcon} alt="Required" className="required-icon" />
          </div>

          <div className="asset-form-field-container">
            <label>Description</label>
            <textarea
              data-field="description"
              placeholder="Enter a 50-200 word description"
              maxLength="1800"
              value={service.description}
              onChange={(e) => handleChange(e, index)}
            />
            <div className="character-count">{1800 - service.description.length}/1800</div>
          </div>

          <div className="asset-form-field-container">
            <label>Are there any volunteering opportunities?</label>
            <button
              type="button"
              className={`volunteer-button ${service.isVolunOpp ? "active" : ""}`}
              onClick={() =>
                setFormData((prevData) =>
                  prevData.map((item, i) =>
                    i === index ? { ...item, isVolunOpp: !item.isVolunOpp } : item
                  )
                )
              }
            >
              Yes
            </button>
            {service.isVolunOpp && (
              <textarea
                data-field="volunOppText"
                placeholder="Please briefly list volunteering opportunities"
                maxLength="400"
                value={service.volunOppText}
                onChange={(e) => handleChange(e, index)}
              />
            )}
          </div>

          <div className="foldable-section">
            <button type="button" className="foldable-header" onClick={() => setShowLocation(!showLocation)}>
              <div>
                <span>Location</span>
                {assetType.physical && <img src={requiredIcon} alt="Required" className="required-icon" />}
              </div>
              <span className="foldable-arrow">{showLocation ? "▼" : "▶"}</span>
            </button>
            {showLocation && <AddAssetFormLocation handleChange={handleChange} service={service} index={index} />}
          </div>

          <div className="foldable-section">
            <button type="button" className="foldable-header" onClick={() => setShowContact(!showContact)}>
              <div>
                <span>Contact Information</span>
                {!assetType.physical && <img src={requiredIcon} alt="Required" className="required-icon" />}
              </div>
              <span className="foldable-arrow">{showContact ? "▼" : "▶"}</span>
            </button>
            {showContact && <AddAssetFormContacts handleChange={handleChange} service={service} index={index} setFormData={setFormData} />}
          </div>

          {assetType.multiple && index === formData.length - 1 && formData.length > 1 && (
            <button type="button" className="delete-button" onClick={handleRemoveLastService}>
              Remove
            </button>
          )}

          {assetType.multiple && (
            <button type="button" onClick={handleAddService} disabled={!allFormsValid} className={!allFormsValid ? "disabled-button" : ""}>
              + Add Another Service or Program
            </button>
          )}


        </div>
      ))}





      <button type="button" onClick={() => setStep(3)} disabled={!allFormsValid} className={!allFormsValid ? "disabled-button" : ""}>
        Proceed
      </button>
      
      <button type="button" onClick={handleClearForm}>
        Clear
      </button>
    </div>
  );
};

export default AddAssetFormStep2;