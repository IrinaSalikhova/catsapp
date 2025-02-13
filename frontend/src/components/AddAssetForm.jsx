import React, { useEffect, useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import '../assets/NewAssetForm.css';
import cchclogo from "/big_logo.png";

const carlingtonIcon = '/carlington_icon.webp';



const NewAssetForm = ({ onClose }) => {

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };
    
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <img src={carlingtonIcon} alt="Carlington Logo" className="logo" />
          <h1>New Community Resource Form </h1>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div>
          <text> Hi, thank you for your willingness to help your community with this valuable information. 
            Before proceeding to the form, please answer the following questions:</text>
        </div>
        <div> 
          <text> Are there multiple resources under a single entity or is it a standalone resource? </text>
          <button className="multiple" onClick={ToggleEvent}>Input main and sub entities</button>
          <button className="standalone" onClick={ToggleEvent}>Standalone</button>
          </div>
          <div>
            <text> Does the asset have a physical location?</text>
            <button className="yes" onClick={ToggleEvent}>Yes</button>
            <button className="no" onClick={ToggleEvent}>No</button>
          </div>
        <form id="suggestionForm">
          <div className="form-grid">
            <div>
              <label htmlFor="name">Resource Name:</label>
              <input type="text" id="name" placeholder="Enter the service name" required />
              
              
              <div>
                    <CategoryDropdown onCategorySelect={handleCategorySelect} />
              </div>

              
              <label htmlFor="description">Description:</label>
              <textarea id="description" placeholder="Describe your suggestion" required></textarea>
              
              <label>Are there any volunteering opportunities available within this resource?</label>
              <div className="volunteer-options">
              <button className="yes" onClick={ToggleEvent}>Yes</button> 
              <button className="no" onClick={ToggleEvent}>No</button> 
              <input type="text" id="volunteer" placeholder="Enter the opportunities"/>
              </div>
              
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" placeholder="Enter address" required />
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <input type="text" id="city" value="Ottawa" placeholder="Enter city" required />
              
              <label htmlFor="postal">Postal Code:</label>
              <input type="text" id="postal" placeholder="Enter postal code" required />
              
              <label htmlFor="phone">Phone:</label>
              <input type="tel" id="phone" placeholder="Enter phone number" required />
              
              <label htmlFor="additionalPhone">Additional Phone:</label>
              <input type="tel" id="additionalPhone" placeholder="Enter additional phone number" />
              
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="Enter email address" required />
              
              <label htmlFor="website">Website:</label>
              <input type="url" id="website" placeholder="Enter website URL" />
            </div>
          </div>
          
          <label htmlFor="recurrence">Recurrence:</label>
          <select id="recurrence">
            <option value="once">Once</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          
          <label htmlFor="format">Format:</label>
          <select id="format">
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
          
          <label>Accessibility:</label>
          <div className="accessibility-options">
            <input type="checkbox" id="wheelchairAccessible" name="wheelchairAccessible" /> Wheelchair Accessible
            <input type="checkbox" id="languagesOffered" name="languagesOffered" /> Languages Offered
          </div>
          
          <label htmlFor="registrationInfo">Registration Information:</label>
          <input type="text" id="registrationInfo" placeholder="Enter registration information" />
          
          <label htmlFor="additionalNotes">Additional Notes:</label>
          <textarea id="additionalNotes" placeholder="Enter any additional notes"></textarea>
          
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewAssetForm;
