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
        <div class="form-grid">
        <div>
          <label> Hi, thank you for your willingness to help your community with this valuable information. 
            Before proceeding to the form, please answer the following questions:</label>
        </div>
                  <div>
                    <label for="assetdivision">Are there multiple resources under a single <span title="Entity is either a building, program at a specific location, or an online program to benefit the community">
                      <u>entity</u></span> or is it a standalone resource?</label>
                    <label id="assetdivision" name="assetdivision"></label>
                      <button type="assetdivisionMultiple" onClick={ToggleEvent}>Multiple</button>
                      <button type ="assetdivisionStandalone" onClick={ToggleEvent}>Standalone</button>
                    <label for="assetplace">Does the asset have a <span title = "Can be a building, or a meeting spot for an activity or program"><u>physical location?</u></span></label>
                    <label id="assetplace" name="assetplace"></label>
                      <button type="assetplaceYes" onClick={ToggleEvent}>Yes</button>
                      <button type="assetplaceNo" onClick={ToggleEvent}>No</button>
                    <label for="name">Resource Name*</label>
                    <input type="text" id="name" placeholder="Enter resource name" required/>
                </div>
              <div>
                    <CategoryDropdown onCategorySelect={handleCategorySelect} />
              </div>

                <div>
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Describe your suggestion" required></textarea>

                    <label for="volunteer">Are there any volunteering opportunities available within this resource?</label>
                    <label id="volunteer" name="volunteer"></label>
                      <button type ="volunteerYes" onClick={ToggleEvent}>Yes</button>
                      <button type ="volunteerNo" onClick={ToggleEvent}>No</button>
                    <label for="volunteerDes">If yes,</label>
                    <textarea id="volunteerDes" placeholder="Description" required></textarea>
                    <label for="address">Address</label>
                    <input type="text" id="address" placeholder="Enter address" required/>
                </div>
                <div>
                    <label for="city">City</label>
                    <input type="text" id="city" value="" placeholder="Enter city" required/>

                    <label for="postal">Postal Code</label>
                    <input type="text" id="postal" placeholder="Enter postal code" required/>

                    <label for="transportation">Transportation Options</label>
                    <input type="text" id="transportation" placeholder="Enter options" required/>
                </div>
                <div>
                    <label for="postal">Hours of Operations</label>
                    <label for="">From</label>
                    <input type="datetime-local" id="datetime" name="datetime" required/>
                    <label for="">to</label>
                    <input type="datetime-local" id="datetime" name="datetime" required/>

                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="Enter phone number" required/>

                    <label for="additionalPhone">Additional Phone</label>
                    <input type="tel" id="additionalPhone" placeholder="Enter additional phone number"/>

                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter email address" required/>

                    <label for="website">Website</label>
                    <input type="url" id="website" placeholder="Enter website URL"/>
                </div>
            <div>
            <label for="recurrence">Recurrence</label>
            <select id="recurrence">
                <option value="once">Once</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value= "daily">Daily</option>
                <option value= "always">Always</option>
                <option value= "onDemand">On-Demand</option>
            </select>

            <label for="format">Format</label>
            <select id="format">
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
            </select>

            <label>Accessibility</label>
            <div class="accessibility-options">
                <input type="checkbox" id="wheelchairAccessible" name="wheelchairAccessible"/> Wheelchair Accessible
                <input type="checkbox" id="languagesOffered" name="languagesOffered"/> Languages Offered
            </div>
            <input type="text" id="registrationInfo" placeholder="Enter Languages Options"/>

            <label for="registrationInfo"><span title="Information like location, timings or a schedule for a certain program/activity">
            <u>Registration Information</u></span></label>
            <input type="text" id="registrationInfo" placeholder="Enter registration information"/>

            <label for="additionalNotes">Additional Notes</label>
            <textarea id="additionalNotes" placeholder="Enter any additional notes"></textarea>

            
            </div>
            <div className='button-container-form'>
            <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewAssetForm;
