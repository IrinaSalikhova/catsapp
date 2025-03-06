import React, { useState, useEffect, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import "../assets/AddAssetForm.css";
import AddAssetFormStep1 from "./AddAssetFormStep1";
import AddAssetFormStep2 from "./AddAssetFormStep2";
import AddAssetFormStep3 from "./AddAssetFormStep3";
import AddAssetFormStep4 from "./AddAssetFormStep4";

const STORAGE_KEY = "assetFormData";

const NewAssetForm = ({ onClose, onSubmit, assetData, isLoggedIn, userRole }) => {
  
  const [isNew, setIsNew] = useState(true);// TODO: 

  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState({ multiple: false, physical: false });
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

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { step, assetType, formData } = JSON.parse(savedData);
      setStep(step);
      setAssetType(assetType);
      setFormData(formData);
    } else {
      resetForm();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, assetType, formData }));
    console.log("Saving to localStorage:", formData); // Debugging log
  }, [step, assetType, formData]);

  const resetForm = () => {
    setStep(1);
    setAssetType({ multiple: false, physical: false });
    setFormData([
      {
        assetId: null,
        
        name: "",
        categoryIds: [],
        description: "",
        isVolunOpp: false,
        volunOppText: "",
        socialWorkerOnlyNote: "",        
        
        cityName: "",
        address: "",
        postCode: "",
        transportation: "",
        longitude: null,
        latitude: null,
        
        email: [],
        phoneNumber: [],
        website: [],

        registrationNote: "",
        scheduleNote: "",
        isWheelchairAcc: false,
        languagesOffered: [],
        scheduleType: "",
        format: [],

        createdEmail: "",
      }
    ]);
    localStorage.removeItem(STORAGE_KEY);
  };



  const handleEmailEntered = (createdEmail) => {
    setFormData(prevData =>
      prevData.map(item =>
        ({ ...item, createdEmail })
        ));};


  const handleChange = (e, index, fieldIndex = null) => {
    const { value, type, checked, dataset } = e.target;
    const field = dataset.field;
  
    setFormData(prevData =>
      prevData.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: fieldIndex !== null
                ? item[field].map((val, idx) => (idx === fieldIndex ? value : val))
                : type === "checkbox"
                ? checked
                : value
            }
          : item
      ));};



  const handleCategorySelect = (categories, index, event) => {
    if (event) event.preventDefault(); 
    setFormData((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, categoryIds: categories.map((cat) => cat.id) }
          : item
      ));};

  const handleAssetTypeSelection = (type, value) => {
    setAssetType((prev) => ({ ...prev, [type]: value }));
    if (type === "multiple" && !value) {
      setFormData([formData[0]]);
    }
    
  };
 
  const isFormValid = (index) => {
    const service = formData[index];
    if (!service.name.trim() || service.categoryIds.length === 0) return false;

    // const isAddressEntered = (service.address && service.postCode && service.cityName) || 
    //   (service.longitude !== null && service.latitude !== null);
    // const isContactInfoEntered = service.phoneNumber.length > 0 || service.email.length > 0 || service.website.length > 0;
    // return assetType.physical ? isAddressEntered : isContactInfoEntered;
    return true;
  };

  const allFormsValid = formData.every((_, index) => isFormValid(index));



  const handleAddService = () => {  // RECHECK!!
    if (allFormsValid) {
      setFormData([
        ...formData,
        {  ...formData[0], 
          name: "",
          isVolunOpp: false,
          volunOppText: "",
          description: `A service in ${formData[0].name}`,
        }
      ]);
    }
  };

  const handleRemoveLastService = () => {
    if (formData.length > 1) {
      setFormData((prevData) => prevData.slice(0, -1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // TODO: add back onhovers spans!


  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <h2>
            <span title="a resource, service, program or other activity in your community open to the public">
              New Community Resource Information
            </span>
          </h2>
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
            <AddAssetFormStep2
              formData={formData}
              handleChange={handleChange}
              handleCategorySelect={handleCategorySelect}
              assetType={assetType}
              handleAddService={handleAddService}
              allFormsValid={allFormsValid}
              setFormData={setFormData}
              resetForm={resetForm}
              setStep={setStep}
              handleRemoveLastService={handleRemoveLastService}
            />
          )}

          {step === 3 && (
            <AddAssetFormStep3
              handleEmailEntered={handleEmailEntered}
              handleSubmit={handleSubmit}
              setStep={setStep}
            />
          )}

          {step === 4 && (
            <AddAssetFormStep4
              onClose={onClose}
              resetForm={resetForm}
            />
          )}

        </form>
      </div>
    </div>
  );
};

export default NewAssetForm;
