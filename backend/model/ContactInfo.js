// ContactInfo.js
class ContactInfo {
    constructor({ email = [], phoneNumber = [], website = [] }) {

        this.email = Array.isArray(email) ? email : (email ? email.split('|').filter(e => e) : []);
        this.phoneNumber = Array.isArray(phoneNumber) ? phoneNumber : (phoneNumber ? phoneNumber.split('|').filter(p => p) : []);
        this.website = Array.isArray(website) ? website : (website ? website.split('|').filter(w => w) : []);        
    }

    toDatabaseFormat() {
        return {
            email: this.email?.length ? this.email.join('|') : null,
            phoneNumber: this.phoneNumber?.length ? this.phoneNumber.join('|') : null,
            website: this.website?.length ? this.website.join('|') : null,
        };
    }

}

module.exports = ContactInfo;