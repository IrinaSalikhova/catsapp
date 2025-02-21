// AssetDraft.js
const Joi = require('joi');
const db = require('../db');
const Address = require('./Address');
const ContactInfo = require('./ContactInfo');
const sendEmail = require('../emailService').sendEmail;


const assetDraftSchema = Joi.object({
    id: Joi.number().integer().optional(), 
    assetId: Joi.number().integer().allow(null).optional(),
    categoryIds: Joi.array().items(Joi.number().integer()).required(),
    name: Joi.string().required(),
    description: Joi.string().allow(null).optional(),
    isVolunOpp: Joi.boolean().allow(null).default(false),
    volunOppText: Joi.string().allow(null).optional(),
    registrationNote: Joi.string().allow(null).optional(),
    scheduleNote: Joi.string().allow(null).optional(),
    status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
    createdEmail: Joi.string().allow(null).email().optional(),
    createDate: Joi.date().allow(null).optional(),

    cityName: Joi.string().allow(null).optional(),
    cityCode: Joi.number().allow(null).optional(),
    address: Joi.string().allow(null).optional(),
    postCode: Joi.string().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),

    email: Joi.alternatives().try(
        Joi.array().items(Joi.string().email()).allow(null),
        Joi.string().allow(null)
    ).optional(),
    phoneNumber: Joi.alternatives().try(
        Joi.array().items(Joi.string()).allow(null),
        Joi.string().allow(null)
    ).optional(),
    website: Joi.alternatives().try(
        Joi.array().items(Joi.string()).allow(null),
        Joi.string().allow(null)
    ).optional(),
});

class AssetDraft {
    constructor({data}) {
        const { error, value } = assetDraftSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        this.id = value.id;
        this.assetId = value.assetId;
        this.categoryIds = value.categoryIds;
        this.name = value.name;
        this.description = value.description;
        this.isVolunOpp = value.isVolunOpp instanceof Buffer ? Boolean(value.isVolunOpp.readUInt8(0)) : value.isVolunOpp;
        this.volunOppText = value.volunOppText;
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.status = value.status;
        this.createdEmail = value.createdEmail;
        this.createDate = value.createDate;
        this.address = new Address({ 
            cityName: value.cityName, 
            cityCode: value.cityCode, 
            address: value.address, 
            postCode: value.postCode, 
            latitude: value.latitude, 
            longitude: value.longitude });
        this.contactInfo = new ContactInfo({email: value.email, phoneNumber: value.phoneNumber, website: value.website});

    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();

            const [result] = await connection.query(
                `INSERT INTO assetsDraft (assetId, name, description, isVolunOpp, volunOppText, 
                registrationNote, scheduleNote, status, createdEmail, 
                 cityCode, address, postCode, longitude, latitude, 
                 phoneNumber, email, website)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [this.assetId, this.name, this.description, this.isVolunOpp, this.volunOppText, 
                    this.registrationNote, this.scheduleNote,this.status, this.createdEmail,
                    addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude, 
                    contactData.phoneNumber, contactData.email, contactData.website]
            );
        
            this.id = result.insertId;

            for (const categoryId of this.categoryIds) {
                await connection.query(
                    `INSERT INTO draftCategLinks (assetDraftId, categoryId) VALUES (?, ?)`,
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
            `SELECT ad.*, 
                    GROUP_CONCAT(dcl.categoryId) AS categoryIds,
                     co.cityName AS cityName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             WHERE ad.id = ?
             GROUP BY ad.id`, 
            [id]
        );
    
        if (rows.length === 0) return null;
    
        const assetDraftData = rows[0];
    
        assetDraftData.categoryIds = assetDraftData.categoryIds 
            ? assetDraftData.categoryIds.split(',').map(Number) 
            : [];

        assetDraftData.isVolunOpp = Boolean(assetDraftData.isVolunOpp.readUInt8(0));
    
        return new AssetDraft({ data: assetDraftData });
    }

    static async getAllPendingAssets() {
        const [rows] = await db.query(
            `SELECT ad.*, 
                    GROUP_CONCAT(dcl.categoryId) AS categoryIds,
                    co.cityName AS cityName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             WHERE ad.status = 'pending'
             GROUP BY ad.id`
        );
    
        return rows.map(row => {
            row.categoryIds = row.categoryIds 
                ? row.categoryIds.split(',').map(Number) 
                : [];
            row.isVolunOpp = Boolean(row.isVolunOpp.readUInt8(0));
            return new AssetDraft({ data: row });
        });
    };

    hasCreatedEmail() {
        return this.createdEmail !== null;
    }

    async sendReply(message) {
        if (!this.hasCreatedEmail()) {
            throw new Error("Cannot send reply: createdEmail is null.");
        }
        const data = {
            name: this.name,
            status: this.status,
            body: message
        };
        const subject = "Update on the community resource you suggested "

        await sendEmail(this.createdEmail, subject, 'replyOnDraft', data);
    }

    async changeState(newState) {
        if (!["approved", "rejected"].includes(newState)) {
            throw new Error("Invalid state change. Must be 'approved' or 'rejected'.");
        }
        
        const connection = await db.getConnection();
        try {
            await connection.query(
                `UPDATE assetsDraft SET status = ? WHERE id = ?`,
                [newState, this.id]
            );
            this.status = newState;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async editAssetDraft(updatedData) {
        const { error, value } = assetDraftSchema.validate(updatedData);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        if (!this.id) {
            throw new Error("Asset draft not found");
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
    
            this.name = value.name;
            this.description = value.description;
            this.isVolunOpp = value.isVolunOpp;
            this.volunOppText = value.volunOppText;
            this.registrationNote = value.registrationNote;
            this.scheduleNote = value.scheduleNote;
            this.status = value.status;
            this.address.cityName = value.cityName;
            this.address.address = value.address;
            this.address.postCode = value.postCode;
            this.address.longitude = value.longitude;
            this.address.latitude = value.latitude;
            this.contactInfo.phoneNumber = value.phoneNumber;
            this.contactInfo.email = value.email;
            this.contactInfo.website = value.website;
            this.categoryIds = value.categoryIds;

            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();
    
            await connection.query(
                `UPDATE assetsDraft 
                 SET name = ?, description = ?, isVolunOpp = ?, volunOppText = ?,
                     registrationNote = ?, scheduleNote = ?, status = ?,
                     cityCode = ?, address = ?, postCode = ?, longitude = ?, latitude = ?,
                     phoneNumber = ?, email = ?, website = ?
                 WHERE id = ?`,
                [this.name, this.description, this.isVolunOpp, this.volunOppText,
                 this.registrationNote, this.scheduleNote, this.status,
                 addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude,
                 contactData.phoneNumber, contactData.email, contactData.website,
                 this.id]
            );
    
            await connection.query(
                `DELETE FROM draftCategLinks WHERE assetDraftId = ?`,
                [this.id]
            );
            for (const categoryId of this.categoryIds) {
                await connection.query(
                    `INSERT INTO draftCategLinks (assetDraftId, categoryId) VALUES (?, ?)`,
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

module.exports = AssetDraft;
