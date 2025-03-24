// AssetDraft.js 
const Joi = require('joi');
const db = require('../db');
const Address = require('./Address');
const ContactInfo = require('./ContactInfo');
const Category = require('./Category');
const sendEmail = require('../emailService').sendEmail;


const assetDraftSchema = Joi.object({
    id: Joi.number().integer().allow(null).optional(), 
    assetId: Joi.number().integer().allow(null).optional(),
    hasChildren: Joi.boolean().allow(null).default(false),
    parentAssetDraftId: Joi.number().integer().allow(null).optional(),
    parentAssetDraftName: Joi.string().max(255).allow(null, "").optional(),
    childrenIds: Joi.array().items(Joi.number().integer()).allow(null, "").optional(),
    childrenNames: Joi.array().items(Joi.string().max(255)).allow(null, "").optional(),

    categoryIds: Joi.array().items(Joi.number().integer()).required(),
    categoryNames: Joi.array().items(Joi.string().max(200)).allow(null, "").optional(),
    name: Joi.string().max(255).required(),
    description: Joi.string().max(2000).allow(null, "").optional(),
    isVolunOpp: Joi.boolean().default(false),
    volunOppText: Joi.string().max(500).allow(null, "").optional(),

    scheduleType: Joi.string().max(150).allow(null, "").optional(),
    registrationNote: Joi.string().max(500).allow(null, "").optional(),
    scheduleNote: Joi.string().max(500).allow(null, "").optional(),
    socialWorkerOnlyNote: Joi.string().max(1500).allow(null, "").optional(),
    
    isWheelchairAcc: Joi.boolean().default(false),
    languagesOffered: Joi.alternatives().try(
        Joi.array().items(Joi.string()).allow(null, ""),
        Joi.string().max(150).allow(null, "")
    ).optional(),
    format: Joi.alternatives().try(
        Joi.array().items(
            Joi.string().valid("Online", "On site", "Group", "Individual", "Drop-in", "Scheduled event", "Self-paced"))
            .allow(null, ""),
        Joi.string().max(100).allow(null, "")
    ).optional(),

    status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
    createdEmail: Joi.string().max(100).allow(null, "").email().optional(),
    createDate: Joi.date().allow(null).optional(),

    cityName: Joi.string().max(30).allow(null, "").optional(),
    cityCode: Joi.number().allow(null).optional(),
    address: Joi.string().max(500).allow(null, "").optional(),
    postCode: Joi.string().max(10).allow(null, "").optional(),
    longitude: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),
    transportation: Joi.string().max(300).allow(null, "").optional(),

    email: Joi.alternatives().try(
        Joi.array().items(Joi.string().allow(null, "")).allow(null).empty(Joi.array().length(0)),
        Joi.string().max(500).allow(null, "")
    ).optional(),
    phoneNumber: Joi.alternatives().try(
        Joi.array().items(Joi.string().allow(null, "")).allow(null).empty(Joi.array().length(0)),
        Joi.string().max(500).allow(null, "")
    ).optional(),
    website: Joi.alternatives().try(
        Joi.array().items(Joi.string().allow(null, "")).allow(null).empty(Joi.array().length(0)),
        Joi.string().max(500).allow(null, "")
    ).optional(),
});

class AssetDraft {
    constructor({data}) {
        const { error, value } = assetDraftSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        this.id = value.id;
        this.assetId = value.assetId;
        this.hasChildren = value.hasChildren instanceof Buffer ? Boolean(value.hasChildren.readUInt8(0)) : value.hasChildren;
        this.parentAssetDraftId = value.parentAssetDraftId;        
        this.parentAssetDraftName = value.parentAssetDraftName;  
        this.childrenIds = value.childrenIds;
        this.childrenNames = value.childrenNames;      
        this.categoryIds = value.categoryIds;   
        this.categoryNames = value.categoryNames;      
        this.name = value.name;
        this.description = value.description;
        this.isVolunOpp = value.isVolunOpp instanceof Buffer ? Boolean(value.isVolunOpp.readUInt8(0)) : value.isVolunOpp;
        this.volunOppText = value.volunOppText;
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.isWheelchairAcc = value.isWheelchairAcc instanceof Buffer ? Boolean(value.isWheelchairAcc.readUInt8(0)) : value.isWheelchairAcc;
        this.languagesOffered = Array.isArray(value.languagesOffered) ? value.languagesOffered : (value.languagesOffered ? value.languagesOffered.split('|').filter(l => l) : []);
        this.scheduleType = value.scheduleType;
        this.socialWorkerOnlyNote = value.socialWorkerOnlyNote;
        this.format = Array.isArray(value.format) ? value.format : (value.format ? value.format.split('|').filter(f => f) : []);
        this.status = value.status;
        this.createdEmail = value.createdEmail;
        this.createDate = value.createDate;
        this.address = new Address({ 
            cityName: value.cityName, 
            cityCode: value.cityCode, 
            address: value.address, 
            postCode: value.postCode, 
            latitude: value.latitude, 
            longitude: value.longitude,
            transportation: value.transportation});
        this.contactInfo = new ContactInfo({
            email: value.email, 
            phoneNumber: value.phoneNumber, 
            website: value.website});

    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();

            const languagesOffered = this.languagesOffered.length ? this.languagesOffered.join('|') : null;
            const format = this.format.length ? this.format.join('|') : null;


            const [result] = await connection.query(
                `INSERT INTO assetsDraft (assetId, hasChildren, parentAssetDraftId, 
                name, description, isVolunOpp, volunOppText, 
                registrationNote, scheduleNote, status, createdEmail, 
                 cityCode, address, postCode, longitude, latitude, transportation,
                 phoneNumber, email, website,
                 isWheelchairAcc, languagesOffered, scheduleType, socialWorkerOnlyNote, format)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [this.assetId, this.hasChildren, this.parentAssetDraftId, 
                    this.name, this.description, this.isVolunOpp, this.volunOppText, 
                    this.registrationNote, this.scheduleNote,this.status, this.createdEmail,
                    addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude, addressData.transportation,
                    contactData.phoneNumber, contactData.email, contactData.website,
                    this.isWheelchairAcc, languagesOffered, this.scheduleType, this.socialWorkerOnlyNote, format]
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
                    co.cityName AS cityName,
                    mad.name AS parentAssetDraftName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             LEFT JOIN assetsDraft mad ON ad.parentAssetDraftId = mad.id
             WHERE ad.id = ?
             GROUP BY ad.id`, 
            [id]
        );
    
        if (rows.length === 0) return null;
    
        const assetDraftData = rows[0];
    
        assetDraftData.categoryIds = assetDraftData.categoryIds 
            ? assetDraftData.categoryIds.split(',').map(Number) 
            : [];

        assetDraftData.categoryNames = await Category.getCategoryNamesByIds(assetDraftData.categoryIds);

        assetDraftData.isVolunOpp = Boolean(assetDraftData.isVolunOpp.readUInt8(0));
        assetDraftData.hasChildren = Boolean(assetDraftData.hasChildren.readUInt8(0));
        assetDraftData.isWheelchairAcc = Boolean(assetDraftData.isWheelchairAcc.readUInt8(0));

        if (assetDraftData.hasChildren) {
            const [childrenRows] = await db.query(
                `SELECT id, name FROM assetsDraft WHERE parentAssetDraftId = ?`,
                [id]
            );
            assetDraftData.childrenIds = childrenRows.map(child => child.id);
            assetDraftData.childrenNames = childrenRows.map(child => child.name);
        } else {
            assetDraftData.childrenIds = [];
            assetDraftData.childrenNames = [];
        }
    
        return new AssetDraft({ data: assetDraftData });
    }

    static async getAllPendingAssets() {
        const [rows] = await db.query(
            `SELECT ad.*, 
                    GROUP_CONCAT(dcl.categoryId) AS categoryIds,
                    co.cityName AS cityName,
                    mad.name AS parentAssetDraftName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             LEFT JOIN assetsDraft mad ON ad.parentAssetDraftId = mad.id
             WHERE ad.status = 'pending'
             GROUP BY ad.id`
        );
    
        const assets = await Promise.all(rows.map(async row => {
            row.categoryIds = row.categoryIds 
                ? row.categoryIds.split(',').map(Number) 
                : [];
            row.categoryNames = await Category.getCategoryNamesByIds(row.categoryIds);

            row.isVolunOpp = Boolean(row.isVolunOpp.readUInt8(0));
            row.hasChildren = Boolean(row.hasChildren.readUInt8(0));
            row.isWheelchairAcc = Boolean(row.isWheelchairAcc.readUInt8(0));
            return new AssetDraft({ data: row });
        }));
   
        
        const parentAssets = assets.filter(asset => asset.hasChildren);
        const standaloneAssets = assets.filter(asset => !asset.hasChildren && asset.parentAssetDraftId === null);
        
        parentAssets.forEach(parent => {
            parent.children = assets.filter(asset => asset.parentAssetDraftId === parent.id);
        });
        
        return [...standaloneAssets, ...parentAssets];
    };

    static async getParentWithChildren(parentId) {
        const [parentRows] = await db.query(
            `SELECT ad.*, GROUP_CONCAT(dcl.categoryId) AS categoryIds,
                    co.cityName AS cityName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             WHERE ad.id = ?
             GROUP BY ad.id`, 
            [parentId]
        );

        if (parentRows.length === 0) return null;

        const parentData = parentRows[0];
        parentData.categoryIds = parentData.categoryIds ? parentData.categoryIds.split(',').map(Number) : [];
        parentData.categoryNames = await Category.getCategoryNamesByIds(parentData.categoryIds);

        parentData.isVolunOpp = Boolean(parentData.isVolunOpp.readUInt8(0));
        parentData.hasChildren = Boolean(parentData.hasChildren.readUInt8(0));
        parentData.isWheelchairAcc = Boolean(parentData.isWheelchairAcc.readUInt8(0));
        
        const parent = new AssetDraft({ data: parentData });

        const [childRows] = await db.query(
            `SELECT ad.*, GROUP_CONCAT(dcl.categoryId) AS categoryIds,
                    co.cityName AS cityName
             FROM assetsDraft ad
             LEFT JOIN draftCategLinks dcl ON ad.id = dcl.assetDraftId
             LEFT JOIN cityOptions co ON ad.cityCode = co.code 
             WHERE ad.parentAssetDraftId = ?
             GROUP BY ad.id`, 
            [parentId]
        );

        parent.children = await Promise.all(childRows.map(async row => {
            row.categoryIds = row.categoryIds ? row.categoryIds.split(',').map(Number) : [];
            row.categoryNames = await Category.getCategoryNamesByIds(row.categoryIds);
            row.isVolunOpp = Boolean(row.isVolunOpp.readUInt8(0));
            row.hasChildren = Boolean(row.hasChildren.readUInt8(0));
            row.isWheelchairAcc = Boolean(row.isWheelchairAcc.readUInt8(0));
            return new AssetDraft({ data: row });
        }));


        return parent;
    }

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

            this.assetId = value.assetId ?? this.assetId;
            
            this.name = value.name ?? this.name;
            this.description = value.description ?? this.description;
            if (updatedData.isVolunOpp !== undefined && updatedData.isVolunOpp !== null) {
                this.isVolunOpp = value.isVolunOpp;
            }
            this.volunOppText = value.volunOppText ?? this.volunOppText;
            this.registrationNote = value.registrationNote ?? this.registrationNote;
            this.scheduleNote = value.scheduleNote ?? this.scheduleNote;
            this.socialWorkerOnlyNote = value.socialWorkerOnlyNote ?? this.socialWorkerOnlyNote;
            this.status = 'pending';
            this.address.cityName = value.cityName ?? this.address.cityName;
            this.address.address = value.address ?? this.address.address;
            this.address.postCode = value.postCode ?? this.address.postCode;
            this.address.longitude = value.longitude ?? this.address.longitude;
            this.address.latitude = value.latitude ?? this.address.latitude;
            this.address.transportation = value.transportation ?? this.address.transportation;
            this.contactInfo.phoneNumber = value.phoneNumber ?? this.contactInfo.phoneNumber;
            this.contactInfo.email = value.email ?? this.contactInfo.email;
            this.contactInfo.website = value.website ?? this.contactInfo.website;
            this.categoryIds = value.categoryIds ?? this.categoryIds;
            if (updatedData.isWheelchairAcc !== undefined && updatedData.isWheelchairAcc !== null) {
                this.isWheelchairAcc = value.isWheelchairAcc;
            }
            this.languagesOffered = value.languagesOffered ?? this.languagesOffered;
            this.format = value.format ?? this.format;

            if (updatedData.hasChildren !== undefined && updatedData.hasChildren !== null) {
                this.hasChildren = value.hasChildren;
            }
            this.parentAssetDraftId = value.parentAssetDraftId ?? this.parentAssetDraftId;


            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();
            const languagesOffered = this.languagesOffered.length ? this.languagesOffered.join('|') : null;
            const format = this.format.length ? this.format.join('|') : null;
    
            await connection.query(
                `UPDATE assetsDraft 
                 SET assetId = ?, name = ?, description = ?, isVolunOpp = ?, volunOppText = ?,
                     registrationNote = ?, scheduleNote = ?, status = ?,
                     cityCode = ?, address = ?, postCode = ?, longitude = ?, latitude = ?, transportation = ?,
                     phoneNumber = ?, email = ?, website = ?,
                     isWheelchairAcc = ?, languagesOffered = ?, scheduleType = ?, socialWorkerOnlyNote = ?, format = ?,
                     hasChildren = ?, parentAssetDraftId = ?
                 WHERE id = ?`,
                [this.assetId, this.name, this.description, this.isVolunOpp, this.volunOppText,
                 this.registrationNote, this.scheduleNote, this.status,
                 addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude, addressData.transportation,
                 contactData.phoneNumber, contactData.email, contactData.website,
                 this.isWheelchairAcc, languagesOffered, this.scheduleType, this.socialWorkerOnlyNote, format,
                 this.hasChildren, this.parentAssetDraftId,
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

    toPlainData() {
        return {
            draftId: this.id,
            hasChildren: this.hasChildren,
            categoryIds: this.categoryIds,
           
            name: this.name,
            description: this.description,
            isVolunOpp: this.isVolunOpp,
            volunOppText: this.volunOppText,

            socialWorkerOnlyNote: this.socialWorkerOnlyNote,
            registrationNote: this.registrationNote,
            scheduleNote: this.scheduleNote,
            isWheelchairAcc: this.isWheelchairAcc,
            scheduleType: this.scheduleType,

            languagesOffered: this.languagesOffered,
            format: this.format,

            cityName: this.address.cityName,
            cityCode: this.address.cityCode,
            address: this.address.address,
            postCode: this.address.postCode,
            longitude: this.address.longitude,
            latitude: this.address.latitude,
            transportation: this.address.transportation,

            email: this.contactInfo.email,
            phoneNumber: this.contactInfo.phoneNumber,
            website: this.contactInfo.website,
        };
    }
    
}

module.exports = AssetDraft;
