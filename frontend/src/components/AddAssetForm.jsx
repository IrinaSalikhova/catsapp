import React from 'react';
import '../assets/NewAssetForm.css';
import cchclogo from "/big_logo.png";

const carlingtonIcon = '/carlington_icon.webp';

const NewAssetForm = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <h1>Asset Suggestion Form</h1>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <form id="suggestionForm">
        <div class="form-grid">
                <div>
                    <label for="assetdivision">Does the new asset provide several services and activities or is it a standalone asset?</label>
                    <label id="assetdivision" name="assetdivision"></label>
                        <input type="checkbox" id="assetdivisionYes" name="assetdivisionYes" value="yes"/> Yes: Proceed to multi-input of main and collateral assets
                        <input type="checkbox" id="assetdivisionNo" name="assetdivisionNo" value="no"/> No: Proceed to standalone
                    <label for="assetplace">Does the asset have a physical location?</label>
                    <label id="assetplace" name="assetplace"></label>
                        <input type="checkbox" id="assetplaceYes" name="assetplaceYes" value="yes"/> Yes: Address is necessary
                        <input type="checkbox" id="assetplaceNo" name="assetplaceNo" value="no"/> Online: Website is necessary
                    <label for="name">Resource Name*</label>
                    <input type="text" id="name" placeholder="Enter name" required/>
                </div>
                <div>
                    <label for="category">Category*</label>
                    <select id="category" title="Select a category">
                        <option value="health-services">Health Services</option>
                        <option value="primary-health-care">Primary Health Care</option>
                    </select>
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Describe your suggestion" required></textarea>

                    <label for="volunteer">Volunteer Opportunities</label>
                    <label id="volunteer" name="volunteer"></label>
                        <input type="checkbox" id="volunteerYes" name="volunteerYes" value="yes"/> Yes
                        <input type="checkbox" id="volunteerNo" name="volunteerNo" value="no"/> No
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

            <label for="registrationInfo">Registration Information</label>
            <input type="text" id="registrationInfo" placeholder="Enter registration information"/>

            <label for="additionalNotes">Additional Notes</label>
            <textarea id="additionalNotes" placeholder="Enter any additional notes"></textarea>

            
            </div>
            <div className='button-container'>
            <button type="submit">Submit</button>
            </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssetForm;
