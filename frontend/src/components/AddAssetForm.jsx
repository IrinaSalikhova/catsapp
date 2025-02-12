import React from 'react';
import '../assets/NewAssetForm.css';

const carlingtonIcon = '/carlington_icon.webp';

const NewAssetForm = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <img src={carlingtonIcon} alt="Carlington Logo" className="logo" />
          <h1>Asset Suggestion Form</h1>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <form id="suggestionForm">
          <div className="form-grid">
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" placeholder="Enter your name" required />
              
              <label htmlFor="category">Category:</label>
              <select id="category" title="Select a category">
                <option value="health-services">Health Services</option>
                <option value="primary-health-care">Primary Health Care</option>
              </select>
              
              <label htmlFor="description">Description:</label>
              <textarea id="description" placeholder="Describe your suggestion" required></textarea>
              
              <label>Volunteer Opportunities:</label>
              <div className="volunteer-options">
                <input type="checkbox" id="volunteerYes" name="volunteer" value="yes" /> Yes
                <input type="checkbox" id="volunteerNo" name="volunteer" value="no" /> No
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
