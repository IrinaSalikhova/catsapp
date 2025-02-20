// Address.js
const db = require('../db');

class Address {
    constructor({ cityName = '', cityCode = '', address = '', postCode = '', longitude = '', latitude = '' }) {
        this.cityName = cityName; // Comes from frontend
        this.cityCode = cityCode; // Will be found/inserted in DB
        this.address = address;
        this.postCode = postCode;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    static async getCityCode(cityName) {
        if (!cityName) return null;

        const [existingCity] = await db.query('SELECT code FROM cityOptions WHERE name = ?', [cityName]);
        if (existingCity.length) {
            return existingCity[0].code; 
        }

        await db.query('INSERT INTO cityOptions (name) VALUES (?, ?)', [cityName, 'ON']);
        const [newCity] = await db.query('SELECT code FROM cityOptions WHERE name = ?', [cityName]);

        return newCity.length ? newCity[0].code : null;
    }

    async toDatabaseFormat() {
        return {
            cityCode: this.cityCode || (await Address.getCityCode(this.cityName)),
            address: this.address,
            postCode: this.postCode,
            longitude: this.longitude,
            latitude: this.latitude,
        };
    }
}

module.exports = Address;