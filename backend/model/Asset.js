// damn yet
const Joi = require('joi');
const db = require('../db');
const Address = require('./Address');
const ContactInfo = require('./ContactInfo');

const assetSchema = Joi.object({
    id: Joi.number().integer().optional(),
    parentAssetId: Joi.number().integer().allow(null).optional(),
    categoryIds: Joi.array().items(Joi.number().integer()).required(),
    name: Joi.string().max(255).required(),
    description: Joi.string().max(2000).allow(null).optional(),
    isVolunOpp: Joi.boolean().default(false),
    volunOppText: Joi.string().max(500).allow(null).optional(),
    scheduleType: Joi.string().max(150).allow(null).optional(),
    registrationNote: Joi.string().max(500).allow(null).optional(),
    scheduleNote: Joi.string().max(500).allow(null).optional(),
    socialWorkerOnlyNote: Joi.string().max(1500).allow(null).optional(),
    isWheelchairAcc: Joi.boolean().default(false),
    languagesOffered: Joi.array().items(Joi.string()).allow(null).optional(),
    format: Joi.array().items(Joi.string()).allow(null).optional(),
    address: Joi.object().instance(Address).required(),
    contactInfo: Joi.object().instance(ContactInfo).required()
});

class Asset {
    constructor({ data }) {
        const { error, value } = assetSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        this.id = value.id;
        this.parentAssetId = value.parentAssetId;
        this.categoryIds = value.categoryIds;
        this.name = value.name;
        this.description = value.description;
        this.isVolunOpp = value.isVolunOpp;
        this.volunOppText = value.volunOppText;
        this.scheduleType = value.scheduleType;
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.socialWorkerOnlyNote = value.socialWorkerOnlyNote;
        this.isWheelchairAcc = value.isWheelchairAcc;
        this.languagesOffered = value.languagesOffered || [];
        this.format = value.format || [];
        this.address = value.address;
        this.contactInfo = value.contactInfo;
    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();

            const [result] = await connection.query(
                `INSERT INTO assets (parentAssetId, name, description, isVolunOpp, volunOppText, 
                 registrationNote, scheduleNote, isWheelchairAcc, languagesOffered, scheduleType, 
                 socialWorkerOnlyNote, format, cityCode, address, postCode, longitude, latitude, 
                 phoneNumber, email, website) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [this.parentAssetId, this.name, this.description, this.isVolunOpp, this.volunOppText,
                 this.registrationNote, this.scheduleNote, this.isWheelchairAcc, 
                 this.languagesOffered.join('|'), this.scheduleType, this.socialWorkerOnlyNote, 
                 this.format.join('|'), addressData.cityCode, addressData.address, 
                 addressData.postCode, addressData.longitude, addressData.latitude, 
                 contactData.phoneNumber, contactData.email, contactData.website]
            );
            this.id = result.insertId;

            for (const categoryId of this.categoryIds) {
                await connection.query(
                    `INSERT INTO assetCategLinks (assetId, categoryId) VALUES (?, ?)`,
                    [this.id, categoryId]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT a.*, GROUP_CONCAT(acl.categoryId) AS categoryIds, co.cityName 
             FROM assets a 
             LEFT JOIN assetCategLinks acl ON a.id = acl.assetId
             LEFT JOIN cityOptions co ON a.cityCode = co.code 
             WHERE a.id = ?
             GROUP BY a.id`,
            [id]
        );

        if (rows.length === 0) return null;
        const assetData = rows[0];
        assetData.categoryIds = assetData.categoryIds ? assetData.categoryIds.split(',').map(Number) : [];
        return new Asset({ data: assetData });
    }

    static async getAll() {
        const [rows] = await db.query(
            `SELECT a.*, GROUP_CONCAT(acl.categoryId) AS categoryIds, co.cityName 
             FROM assets a 
             LEFT JOIN assetCategLinks acl ON a.id = acl.assetId
             LEFT JOIN cityOptions co ON a.cityCode = co.code 
             GROUP BY a.id`
        );
        return rows.map(row => new Asset({ data: row }));
    }

    async update(updatedData) {
        const { error, value } = assetSchema.validate(updatedData);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            this.name = value.name;
            this.description = value.description;
            this.isVolunOpp = value.isVolunOpp;
            this.volunOppText = value.volunOppText;
            this.registrationNote = value.registrationNote;
            this.scheduleNote = value.scheduleNote;
            this.isWheelchairAcc = value.isWheelchairAcc;
            this.languagesOffered = value.languagesOffered;
            this.format = value.format;
            this.address = value.address;
            this.contactInfo = value.contactInfo;
            this.categoryIds = value.categoryIds;

            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();

            await connection.query(
                `UPDATE assets SET name = ?, description = ?, isVolunOpp = ?, volunOppText = ?, 
                 registrationNote = ?, scheduleNote = ?, isWheelchairAcc = ?, languagesOffered = ?, 
                 scheduleType = ?, socialWorkerOnlyNote = ?, format = ?, cityCode = ?, 
                 address = ?, postCode = ?, longitude = ?, latitude = ?, phoneNumber = ?, email = ?, website = ?
                 WHERE id = ?`,
                [this.name, this.description, this.isVolunOpp, this.volunOppText,
                 this.registrationNote, this.scheduleNote, this.isWheelchairAcc, 
                 this.languagesOffered.join('|'), this.scheduleType, this.socialWorkerOnlyNote, 
                 this.format.join('|'), addressData.cityCode, addressData.address, 
                 addressData.postCode, addressData.longitude, addressData.latitude, 
                 contactData.phoneNumber, contactData.email, contactData.website, this.id]
            );
            
            await connection.query(
                `DELETE FROM assetCategLinks WHERE assetId = ?`,
                [this.id]
            );
            for (const categoryId of this.categoryIds) {
                await connection.query(
                    `INSERT INTO assetCategLinks (assetId, categoryId) VALUES (?, ?)`,
                    [this.id, categoryId]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Asset;
