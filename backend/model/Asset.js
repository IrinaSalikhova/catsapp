const Joi = require('joi');
const db = require('../db');
const Address = require('./Address');
const ContactInfo = require('./ContactInfo');

const assetSchema = Joi.object({
    id: Joi.number().integer().optional(),
    parentAssetId: Joi.number().integer().allow(null).optional(),
    categoryIds: Joi.array().items(Joi.number().integer()).required(),
    name: Joi.string().required(),
    description: Joi.string().allow(null).optional(),
    isVolunOpp: Joi.boolean().default(false),
    volunOppText: Joi.string().allow(null).optional(),
    registrationNote: Joi.string().allow(null).optional(),
    scheduleNote: Joi.string().allow(null).optional(),
    cityName: Joi.string().allow(null).optional(),
    cityCode: Joi.number().allow(null).optional(),
    address: Joi.string().allow(null).optional(),
    postCode: Joi.string().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),
    email: Joi.alternatives().try(Joi.string().email().allow(null), Joi.array().items(Joi.string().email().allow(null))).optional(),
    phoneNumber: Joi.alternatives().try(Joi.string().allow(null), Joi.array().items(Joi.string().allow(null))).optional(),
    website: Joi.alternatives().try(Joi.string().allow(null), Joi.array().items(Joi.string().allow(null))).optional(),
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
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.address = new Address({
            cityName: value.cityName,
            cityCode: value.cityCode,
            address: value.address,
            postCode: value.postCode,
            latitude: value.latitude,
            longitude: value.longitude
        });
        this.contactInfo = new ContactInfo({
            email: value.email,
            phoneNumber: value.phoneNumber,
            website: value.website
        });
    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();

            const [result] = await connection.query(
                `INSERT INTO assets (parentAssetId, name, description, isVolunOpp, volunOppText,
                registrationNote, scheduleNote, cityCode, address, postCode, longitude, latitude, phoneNumber, email, website)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [this.parentAssetId, this.name, this.description, this.isVolunOpp, this.volunOppText,
                    this.registrationNote, this.scheduleNote, addressData.cityCode, addressData.address, addressData.postCode,
                    addressData.longitude, addressData.latitude, contactData.phoneNumber, contactData.email, contactData.website]
            );
            this.id = result.insertId;

            for (const categoryId of this.categoryIds) {
                await connection.query(`INSERT INTO assetCategoryLinks (assetId, categoryId) VALUES (?, ?)`,
                    [this.id, categoryId]);
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
             LEFT JOIN assetCategoryLinks acl ON a.id = acl.assetId
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
}

module.exports = Asset;
