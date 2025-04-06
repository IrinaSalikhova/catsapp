import React from "react";

const AddAssetFormStep1 = ({ assetType, handleAssetTypeSelection, setStep }) => {
  return (
    <div className="form-grid">
      <label>
      Thank you for helping your community! Your information will make a real difference. <br></br> <br></br>
      Before we start, please answer these two quick questions:
      </label>

      <div>
        <label>Is this a group or organization that offers MORE THAN ONE service or program?</label>
        <div className="question-toggle">
          <button
            type="button"
            className={assetType.multiple ? "active" : ""}
            onClick={() => handleAssetTypeSelection("multiple", true)}
          >
            More than one service or program
          </button>
          <button
            type="button"
            className={!assetType.multiple ? "active" : ""}
            onClick={() => handleAssetTypeSelection("multiple", false)}
          >
            Just one service/program
          </button>
        </div>
      </div>

      <div>
        <label>Does this group or organization have a BUILDING or OFFICE where people can go?</label>
        <div className="question-toggle">
          <button
            type="button"
            className={assetType.physical ? "active" : ""}
            onClick={() => handleAssetTypeSelection("physical", true)}
          >
            Yes, they have a physical location
          </button>
          <button
            type="button"
            className={!assetType.physical ? "active" : ""}
            onClick={() => handleAssetTypeSelection("physical", false)}
          >
            No, it's online or without a place
          </button>
        </div>
      </div>

      <button className='btn-primary' type="button" onClick={() => setStep(2)}>Proceed</button>
    </div>
  );
};

export default AddAssetFormStep1;
