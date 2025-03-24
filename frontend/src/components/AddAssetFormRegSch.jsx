import React, { useState, useEffect } from "react";

const AddAssetFormRegSch = ({ handleChange, service, index, setFormData }) => {
  const languages = ["English", "French", "Arabic", "Sign"];
  const formats = ["Online", "On site", "Group", "Individual", "Drop-in", "Scheduled event", "Self-paced"];

  const existingOtherLanguage = service.languagesOffered.find(
    (lang) => !languages.includes(lang)
  ) || "";

  const [otherLanguage, setOtherLanguage] = useState(existingOtherLanguage);
  const [isOtherSelected, setIsOtherSelected] = useState(!!existingOtherLanguage);

  useEffect(() => {
    const existingOther = service.languagesOffered.find((lang) => !languages.includes(lang)) || "";
    setOtherLanguage(existingOther);
    setIsOtherSelected(!!existingOther);
  }, [service.languagesOffered]);

  const handleLanguageToggle = (lang) => {
    const newLanguages = service.languagesOffered.includes(lang)
      ? service.languagesOffered.filter((l) => l !== lang) 
      : [...service.languagesOffered, lang]; 

    handleChange({ target: { value: newLanguages, dataset: { field: "languagesOffered" } } }, index);
  };


  const handleOtherLanguageChange = (e) => {
    const value = e.target.value;
    setOtherLanguage(value);

    const filteredLanguages = service.languagesOffered.filter((l) => l !== otherLanguage);
    const newLanguages = value.trim() ? [...filteredLanguages, value] : filteredLanguages;

    handleChange({ target: { value: newLanguages, dataset: { field: "languagesOffered" } } }, index);
  };

  const toggleOtherLanguage = () => {
    if (isOtherSelected) {
      setOtherLanguage("");
      setIsOtherSelected(false);

      const newLanguages = service.languagesOffered.filter((l) => l !== otherLanguage);
      handleChange({ target: { value: newLanguages, dataset: { field: "languagesOffered" } } }, index);
    } else {
      setIsOtherSelected(true);
    }
  };

  const handleFormatToggle = (fmt) => {
    const newFormats = service.format.includes(fmt)
      ? service.format.filter((f) => f !== fmt) // Remove if exists
      : [...service.format, fmt]; // Add if not exists

    handleChange({ target: { value: newFormats, dataset: { field: "format" } } }, index);
  };

  return (

    
    <div className="registration-schedule-form">

      <div className="asset-form-field-container">
        <label>Schedule Information</label>
        <textarea
          data-field="scheduleNote"
          placeholder="ex. Open: Wednesdays only, 2pm-6pm."
          maxLength="500"
          value={service.scheduleNote}
          onChange={(e) => handleChange(e, index)}
        />
        <div className="character-count">{500 - service.scheduleNote.length}/500</div>
      </div>


      <div className="asset-form-field-container">
        <label>Registration Information</label>
        <textarea
          data-field="registrationNote"
          placeholder="ex. Limited spots available. To register contact by email or phone."
          maxLength="500"
          value={service.registrationNote}
          onChange={(e) => handleChange(e, index)}
        />
        <div className="character-count">{500 - service.registrationNote.length}/500</div>
      </div>

     
      <div className="asset-form-field-container">
        <label>Accessibility Features</label>
      <div className="asset-form-field-container">
      <button
              type="button"
              className={`volunteer-button ${service.isWheelchairAcc ? "active" : ""}`}
              onClick={() =>
                setFormData((prevData) =>
                  prevData.map((item, i) =>
                    i === index ? { ...item, isWheelchairAcc: !item.isWheelchairAcc } : item
                  )
                )
              }
            >
              Wheelchair Accessible
            </button>

      </div>
      </div>

      <div className="asset-form-field-container">
  <label>Languages Offered</label>
  <div className="asset-form-field-container">
  {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`volunteer-button ${service.languagesOffered.includes(lang) ? "active" : ""}`}
              onClick={() => handleLanguageToggle(lang)}
            >
              {lang}
            </button>
          ))}

          <button
            type="button"
            className={`volunteer-button ${isOtherSelected ? "active" : ""}`}
            onClick={toggleOtherLanguage}
          >
            Other
          </button>

          {isOtherSelected && (
            <div className="asset-form-field-container">
            <textarea
              maxLength="50"
              placeholder="Specify languages"
              value={otherLanguage}
              onChange={handleOtherLanguageChange}
              rows="1"
            />
            <div className="character-count">{50 - otherLanguage.length}/50</div>
            </div>
          )}
  </div>
</div>

      
    

<div className="asset-form-field-container">
        <label>Format</label>
        <div className="asset-form-field-container">
          {formats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={`volunteer-button ${service.format.includes(fmt) ? "active" : ""}`}
              onClick={() => handleFormatToggle(fmt)}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddAssetFormRegSch;