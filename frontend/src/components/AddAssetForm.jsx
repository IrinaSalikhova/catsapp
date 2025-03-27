import React, { useState, useEffect, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import "../assets/AddAssetForm.css";
import AddAssetFormStep1 from "./AddAssetFormStep1";
import AddAssetFormStep2 from "./AddAssetFormStep2";
import AddAssetFormStep3 from "./AddAssetFormStep3";
import AddAssetFormStep4 from "./AddAssetFormStep4";

const STORAGE_KEY = "assetFormData";

const AddAssetForm = ({ onClose, existingAssetData, userRole, isLoaded, loadError, token }) => {
  
  const [isNew, setIsNew] = useState(true); 
  const [editingMode, setEditingMode] = useState(false);

  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState({ multiple: false, physical: false });
  const [submissionStatus, setSubmissionStatus] = useState({ success: false, message: "" });
  const [formData, setFormData] = useState([
    {
      id: null,
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

  useEffect(() => {

    if (existingAssetData) { //TODO: need additional work when will be testible 
      setEditingMode(true);
      setFormData([existingAssetData]); 
      setIsNew(false);
    } else {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData && isNew) {
        const { step, assetType, formData } = JSON.parse(savedData);
        setStep(step);
        setAssetType(assetType);
        setFormData(formData);
        setIsNew(false);
  }}}, [isNew, existingAssetData]);

  useEffect(() => {
    if (!isNew) {  
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, assetType, formData }));
      console.log("Saving to localStorage:", formData); // Debugging log
  }
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
    const { value, type, checked, multiple, dataset } = e.target;
    const field = dataset.field;
  
    setFormData(prevData =>
      prevData.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item };
          if (fieldIndex !== null) {
            updatedItem[field] = [...(updatedItem[field] || [])];
            updatedItem[field][fieldIndex] = value;
          } else {
            updatedItem[field] = type === "checkbox" ? checked : value;
          }
          return updatedItem;
        } 

        return item;
      }));};




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
    if (type === "multiple" && !value && isNew) {
      setFormData([formData[0]]);
    }
    setIsNew(false);
  };
 
  const isFormValid = (index) => {
    const service = formData[index];
    if (!service.name.trim() || service.categoryIds.length === 0) return false;

    const isAddressEntered = (service.address && service.postCode && service.cityName) || 
      (service.longitude !== null && service.latitude !== null);
    const isContactInfoEntered = service.phoneNumber.length > 0 || service.email.length > 0 || service.website.length > 0;
    return assetType.physical ? isAddressEntered : isContactInfoEntered;
  };

  const allFormsValid = formData.every((_, index) => isFormValid(index));



  const handleAddService = () => {  
    if (allFormsValid) {
      setFormData([
        ...formData,
        {  ...formData[0], 
          id: null,
          assetId: null,

          name: "",
          isVolunOpp: false,
          volunOppText: "",
          description: `A service in ${formData[0].name}`,
          email: [],
          phoneNumber: [],
          website: [],

          registrationNote: "",
          isWheelchairAcc: false,
          scheduleNote: "",
          languagesOffered: [],
          scheduleType: "",
          format: [],
        }
      ]);
    }
  };

  const handleRemoveLastService = () => {
    if (formData.length > 1) {
      setFormData((prevData) => prevData.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole === 'navigator') {
      console.log("Navigator Submitted Form Data:", formData);
      if (editingMode) {
        try {
          // TODO: add editing of existing asset to draft (asset id should be populated)
          console.log("edited asset Data to submit:", formData);
        } catch (error) {
          console.error("Error submitting asset:", error.message);
          alert("Error submitting asset: " + error.message);
        }
      } else {
      try {
        const response = await fetch("/api/assets/addNewAsset", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newAssetData: formData }),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.message || "Failed to submit asset data");
        }
    
        console.log("Success:", result.message);
        setSubmissionStatus({ success: true, message: result.message });
        setStep(4);
    
      } catch (error) {
        console.error("Error submitting asset:", error.message);
        setSubmissionStatus({ success: false, message: error.message });
        setStep(4);
       } 
      }





    } else {
      console.log("Form Data to submit:", formData);
      if (editingMode) {
        try {
          // TODO: add editing of existing asset to draft (asset id should be populated)
          console.log("edited asset Data to submit:", formData);
        } catch (error) {
          console.error("Error submitting asset:", error.message);
          alert("Error submitting asset: " + error.message);
        }
      } else {
      try {
        const response = await fetch("/api/assets/suggestNewAsset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newAssetData: formData }),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.message || "Failed to submit asset data");
        }
    
        console.log("Success:", result.message);
        setSubmissionStatus({ success: true, message: result.message });
        setStep(4);
    
      } catch (error) {
        console.error("Error submitting asset:", error.message);
        setSubmissionStatus({ success: false, message: error.message });
        setStep(4);
       } 
      }
    }
    

    return true; 
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
              isNavigator={userRole === 'navigator'}
              handleSubmit={handleSubmit}
              isLoaded={isLoaded}
              loadError={loadError}
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
              isNavigator={userRole === 'navigator'}
              submissionStatus={submissionStatus}
              setStep={setStep}
            />
          )}

        </form>
      </div>
    </div>
  );
};

export default AddAssetForm;
