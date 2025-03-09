import React, { useState, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import "../assets/AddAssetForm.css";
import requiredIcon from "/required.png";
import AddAssetFormLocation from "./AddAssetFormLocation";
import AddAssetFormContacts from "./AddAssetFormContacts";
import AddAssetFormStep1 from "./AddAssetFormStep1";


const NewAssetForm = ({ onClose, onSubmit, assetData, isLoggedIn, userRole, }) => {
  
  const STORAGE_KEY = "assetFormData"; // TODO: Key for local storage
  const [isNew, setIsNew] = useState(true);// TODO:


  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState({ multiple: false, physical: false });

  const [showLocation, setShowLocation] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFormat, setShowFormat] = useState(false);

  const [formData, setFormData] = useState([
    {
      categoryIds: [],
      assetId: null,
      name: "",
      description: "",
      isVolunOpp: false,
      volunOppText: "",
      registrationNote: "",
      scheduleNote: "",
      isWheelchairAcc: false,
      languagesOffered: [],
      scheduleType: "",
      socialWorkerOnlyNote: "",
      format: [],
      createdEmail: "",
      cityName: "",
      address: "",
      postCode: "",
      transportation: "",
      longitude: null,
      latitude: null,
      email: [],
      phoneNumber: [],
      website: []
    }
  ]);

  const handleChange = (e, index, fieldIndex = null) => {
    const { value, type, checked, multiple, dataset } = e.target;
    const field = dataset.field; // Correct field reference
  
    setFormData(prevData =>
      prevData.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: fieldIndex !== null
                ? item[field].map((val, idx) => (idx === fieldIndex ? value : val)) // Correct nested array handling
                : type === "checkbox"
                ? checked
                : multiple
                ? item[field].includes(value)
                  ? item[field].filter(v => v !== value)
                  : [...item[field], value]
                : value
            }
          : item
      )
    );
  };


  const handleCategorySelect = (categories, index, event) => {
    if (event) event.preventDefault(); 
    setFormData((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, categoryIds: categories.map((cat) => cat.id) }
          : item
      )
    );
  };

  const handleAssetTypeSelection = (type, value) => {
    setAssetType((prev) => ({ ...prev, [type]: value }));
    if (type === "multiple" && !value) {
      setFormData([formData[0]]);
    }
    
  };
 
  const isFormValid = (index) => {
    const service = formData[index];
    return service.name.trim() !== "" && service.description.trim() !== "";
  };

  const allFormsValid = formData.every((_, index) => isFormValid(index));



  const handleAddService = () => {
    if (allFormsValid) {
      setFormData([
        ...formData,
        {  ...formData[0],
          categoryIds: [], 
          assetId: null,
          name: "",
          isVolunOpp: false,
          volunOppText: "",
          registrationNote: "",
          scheduleNote: "",
          isWheelchairAcc: false,
          languagesOffered: [],
          scheduleType: "",
          socialWorkerOnlyNote: "",
          format: [],
          email: [],
          phoneNumber: [],
          website: [],
          description: `A service in ${formData[0].name}`,
        }
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <h2>New Community Resource Information</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>

        <form id="suggestionForm" onSubmit={handleSubmit}>
          {step === 1 && (
  <AddAssetFormStep1 
    assetType={assetType} 
    handleAssetTypeSelection={handleAssetTypeSelection} 
    setStep={setStep} 
  />
)}

          {step === 2 && (
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
                    <div className="character-count">
                      {250 - service.name.length}/250
                    </div>
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
                    <div className="character-count">
                      {1800 - service.description.length}/1800
                    </div>
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
                    <button 
                    type= "button"
                    className="foldable-header" 
                    onClick={() => setShowLocation(!showLocation)}>
                    <div>
                      <span>Location</span>
                      {assetType.physical && <img src={requiredIcon} alt="Required" className="required-icon" />}
                    </div>
                <span className="foldable-arrow">{showLocation ? '▼' : '▶'}</span>
              </button>

              {showLocation && (
  <AddAssetFormLocation 
    handleChange={handleChange} 
    service={service} 
    index={index} 
  />
)}
            </div>


            <div className="foldable-section">
                    <button 
                    type= "button"
                    className="foldable-header" 
                    onClick={() => setShowContact(!showContact)}>
                    <div>
                      <span>Contact Information</span>
                      {!assetType.physical && <img src={requiredIcon} alt="Required" className="required-icon" />}
                    </div>
                <span className="foldable-arrow">{showContact ? '▼' : '▶'}</span>
              </button>
            {showContact && (
              <AddAssetFormContacts 
              handleChange={handleChange} 
              service={service} 
              index={index} 
              setFormData={setFormData}
            />
)}
             
            </div>


                </div>
              ))}

              {assetType.multiple && (
                <button
                  type="button"
                  onClick={handleAddService}
                  disabled={!allFormsValid}
                  className={!allFormsValid ? "disabled-button" : ""}
                >
                  + Add Another Service or Program
                </button>
              )}

              <button type="submit">Submit</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewAssetForm;
