// Asset.js
const Joi = require('joi');
const db = require('../db');
const Address = require('./Address');
const ContactInfo = require('./ContactInfo');
const Category = require('./Category');
const AssetDraft = require('./AssetDraft');
const User = require('./User');




const assetSchema = Joi.object({
    id: Joi.number().integer().allow(null).optional(), 
    draftId: Joi.number().integer().allow(null).optional(),
    hasChildren: Joi.boolean().allow(null).default(false),
    parentAssetId: Joi.number().integer().allow(null).optional(),
    parentAssetName: Joi.string().max(255).allow(null, "").optional(),
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

    isEnable: Joi.boolean().default(true),
    createdBy: Joi.number().integer().allow(null).optional(),
    createdName: Joi.string().max(255).allow(null, "").optional(),
    createDate: Joi.date().allow(null).optional(),
    lastUpdateBy: Joi.number().integer().allow(null).optional(),
    lastUpdateName: Joi.string().max(255).allow(null, "").optional(),
    lastUpdateDate: Joi.date().allow(null).optional(),

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

class Asset {
    constructor({ data }) {

        if (data instanceof AssetDraft) {
            data = data.toPlainData(); 
        }

        const { error, value } = assetSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
        
        this.id = value.id;
        this.draftId = value.draftId;
        this.hasChildren = value.hasChildren instanceof Buffer ? Boolean(value.hasChildren.readUInt8(0)) : value.hasChildren;
        this.parentAssetId = value.parentAssetId;
        this.parentAssetName = value.parentAssetName;
        this.childrenIds = value.childrenIds;
        this.childrenNames = value.childrenNames;
        this.categoryIds = value.categoryIds;
        this.categoryNames = value.categoryNames;
        this.name = value.name;
        this.description = value.description;
        this.isVolunOpp = value.isVolunOpp instanceof Buffer ? Boolean(value.isVolunOpp.readUInt8(0)) : value.isVolunOpp;
        this.volunOppText = value.volunOppText;
        this.scheduleType = value.scheduleType;
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.socialWorkerOnlyNote = value.socialWorkerOnlyNote;
        this.isWheelchairAcc = value.isWheelchairAcc instanceof Buffer ? Boolean(value.isWheelchairAcc.readUInt8(0)) : value.isWheelchairAcc;
        this.languagesOffered = Array.isArray(value.languagesOffered) ? value.languagesOffered : (value.languagesOffered ? value.languagesOffered.split('|').filter(l => l) : []);
        this.format = Array.isArray(value.format) ? value.format : (value.format ? value.format.split('|').filter(f => f) : []);
        this.isEnable = value.isEnable;
        this.createdBy = value.createdBy;
        this.createdName = value.createdName;
        this.createDate = value.createDate;
        this.lastUpdateBy = value.lastUpdateBy;
        this.lastUpdateName = value.lastUpdateName;
        this.lastUpdateDate = value.lastUpdateDate;
        this.address = new Address({
            cityName: value.cityName,
            cityCode: value.cityCode,
            address: value.address,
            postCode: value.postCode,
            latitude: value.latitude,
            longitude: value.longitude,
            transportation: value.transportation
        });
        this.contactInfo = new ContactInfo({
            email: value.email,
            phoneNumber: value.phoneNumber,
            website: value.website
        });
    }

    async save(who) {
        this.isEnable = true;
        this.createdBy = who;
        this.lastUpdateBy = who;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const addressData = await this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();
            const languagesOffered = this.languagesOffered.length ? this.languagesOffered.join('|') : null;
            const format = this.format.length ? this.format.join('|') : null;

            const [result] = await connection.query(
                `INSERT INTO assets (draftId, hasChildren, parentAssetId, 
                name, description, isVolunOpp, volunOppText, socialWorkerOnlyNote,
                isEnable, createdBy, lastUpdateBy,
                cityCode, address, postCode, longitude, latitude, transportation,
                phoneNumber, email, website,
                registrationNote, scheduleNote,
                isWheelchairAcc, languagesOffered, scheduleType,  format)
                VALUES (?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?, ?,  ?, ?, ?, ?, ?, ?,  ?, ?, ?,  ?, ?,  ?, ?, ?, ?)`,

                [this.draftId, this.hasChildren, this.parentAssetId, 
                    this.name, this.description, this.isVolunOpp, this.volunOppText, this.socialWorkerOnlyNote,
                    this.isEnable, this.createdBy, this.createdBy,
                    addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude, addressData.transportation,
                    contactData.phoneNumber, contactData.email, contactData.website,
                    this.registrationNote, this.scheduleNote,
                    this.isWheelchairAcc, languagesOffered, this.scheduleType,  format]
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


    static formatUserData(assetData) {
        assetData.createdName = assetData.createdByFirstName 
            ? `${assetData.createdByFirstName} ${assetData.createdByLastName} - ${assetData.createdByJobTitle || ''}`.trim()
            : "Deleted user";
            assetData.lastUpdateName = assetData.lastUpdateByFirstName 
            ? `${assetData.lastUpdateByFirstName} ${assetData.lastUpdateByLastName} - ${assetData.lastUpdateByJobTitle || ''}`.trim()
            : "Deleted user";

        delete assetData.createdByFirstName;
        delete assetData.createdByLastName;
        delete assetData.createdByJobTitle;
        delete assetData.lastUpdateByFirstName;
        delete assetData.lastUpdateByLastName;
        delete assetData.lastUpdateByJobTitle;

        return assetData;

    }


    static async getById(id) {
        const [rows] = await db.query(
            `SELECT asset.*, 
                    GROUP_CONCAT(acl.categoryId) AS categoryIds,
                    co.cityName AS cityName,
                    mas.name AS parentAssetName,
                    c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                    l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
             FROM assets asset
             LEFT JOIN assetCategLinks acl ON asset.id = acl.assetId
             LEFT JOIN cityOptions co ON asset.cityCode = co.code 
             LEFT JOIN assets mas ON asset.parentAssetId = mas.id
             LEFT JOIN users c ON asset.createdBy = c.id
             LEFT JOIN users l ON asset.lastUpdateBy = l.id
             WHERE asset.id = ?
             GROUP BY asset.id`, 
            [id]
        );
    
        if (rows.length === 0) return null;
    
        const assetData = this.formatUserData(rows[0]);

    
        assetData.categoryIds = assetData.categoryIds 
            ? assetData.categoryIds.split(',').map(Number) 
            : [];

        assetData.categoryNames = await Category.getCategoryNamesByIds(assetData.categoryIds);

        assetData.isVolunOpp = Boolean(assetData.isVolunOpp.readUInt8(0));
        assetData.hasChildren = Boolean(assetData.hasChildren.readUInt8(0));
        assetData.isWheelchairAcc = Boolean(assetData.isWheelchairAcc.readUInt8(0));
        assetData.isEnable = Boolean(assetData.isEnable.readUInt8(0));
    

        if (assetData.hasChildren) {
            const [childrenRows] = await db.query(
                `SELECT id, name FROM assets WHERE parentAssetId = ? AND isEnable = 1`,
                [id]
            );
            assetData.childrenIds = childrenRows.map(child => child.id);
            assetData.childrenNames = childrenRows.map(child => child.name);
        } else {
            assetData.childrenIds = [];
            assetData.childrenNames = [];
        }
    
        return new Asset({ data: assetData });
    }

    static async getAllEnabledAssets() {
        const [rows] = await db.query(
            `SELECT asset.*, 
                    GROUP_CONCAT(acl.categoryId) AS categoryIds,
                    co.cityName AS cityName,
                    mas.name AS parentAssetName,
                    c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                    l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
             FROM assets asset
             LEFT JOIN assetCategLinks acl ON asset.id = acl.assetId
             LEFT JOIN cityOptions co ON asset.cityCode = co.code 
             LEFT JOIN assets mas ON asset.parentAssetId = mas.id
             LEFT JOIN users c ON asset.createdBy = c.id
             LEFT JOIN users l ON asset.lastUpdateBy = l.id
             WHERE asset.isEnable = 1
             GROUP BY asset.id`
        );
    
        const assets = await Promise.all(rows.map(async row => {

            row = this.formatUserData(row);
            row.categoryIds = row.categoryIds 
                ? row.categoryIds.split(',').map(Number) 
                : [];
            row.categoryNames = await Category.getCategoryNamesByIds(row.categoryIds);

            row.isVolunOpp = Boolean(row.isVolunOpp.readUInt8(0));
            row.hasChildren = Boolean(row.hasChildren.readUInt8(0));
            row.isWheelchairAcc = Boolean(row.isWheelchairAcc.readUInt8(0));
            row.isEnable = Boolean(row.isEnable.readUInt8(0));
            return new Asset({ data: row });
        }));
   
        
        const parentAssets = assets.filter(asset => asset.hasChildren);
        const standaloneAssets = assets.filter(asset => !asset.hasChildren && asset.parentAssetId === null);
        
        parentAssets.forEach(parent => {
            parent.children = assets.filter(asset => asset.parentAssetId === parent.id);
        });
        
        return [...standaloneAssets, ...parentAssets];
    };

    // returns ALL children, even disabled
    static async getParentWithChildren(parentId) {
        const [parentRows] = await db.query(
            `SELECT asset.*, GROUP_CONCAT(acl.categoryId) AS categoryIds,
                    co.cityName AS cityName,
                    c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                    l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
             FROM assets asset
             LEFT JOIN assetCategLinks acl ON asset.id = acl.assetId
             LEFT JOIN cityOptions co ON asset.cityCode = co.code 
             LEFT JOIN users c ON asset.createdBy = c.id
             LEFT JOIN users l ON asset.lastUpdateBy = l.id
             WHERE asset.id = ?
             GROUP BY asset.id`, 
            [parentId]
        );

        if (parentRows.length === 0) return null;

        const parentData = this.formatUserData(parentRows[0]);
        parentData.categoryIds = parentData.categoryIds ? parentData.categoryIds.split(',').map(Number) : [];
        parentData.categoryNames = await Category.getCategoryNamesByIds(parentData.categoryIds);

        parentData.isVolunOpp = Boolean(parentData.isVolunOpp.readUInt8(0));
        parentData.hasChildren = Boolean(parentData.hasChildren.readUInt8(0));
        parentData.isWheelchairAcc = Boolean(parentData.isWheelchairAcc.readUInt8(0));
        parentData.isEnable = Boolean(parentData.isEnable.readUInt8(0));

        
        const parent = new Asset({ data: parentData });

        const [childRows] = await db.query(
            `SELECT asset.*, GROUP_CONCAT(acl.categoryId) AS categoryIds,
                    co.cityName AS cityName,
                    c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                    l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
             FROM assets asset
             LEFT JOIN assetCategLinks acl ON asset.id = acl.assetId
             LEFT JOIN cityOptions co ON asset.cityCode = co.code 
             LEFT JOIN users c ON asset.createdBy = c.id
             LEFT JOIN users l ON asset.lastUpdateBy = l.id
             WHERE asset.parentAssetId = ?
             GROUP BY asset.id`, 
            [parentId]
        );

        parent.children = await Promise.all(childRows.map(async row => {
            row = this.formatUserData(row);
            row.categoryIds = row.categoryIds ? row.categoryIds.split(',').map(Number) : [];
            row.categoryNames = await Category.getCategoryNamesByIds(row.categoryIds);
            row.isVolunOpp = Boolean(row.isVolunOpp.readUInt8(0));
            row.hasChildren = Boolean(row.hasChildren.readUInt8(0));
            row.isWheelchairAcc = Boolean(row.isWheelchairAcc.readUInt8(0));
            row.isEnable = Boolean(row.isEnable.readUInt8(0));
            return new Asset({ data: row });
        }));


        return parent;
    }

    async disableAsset() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                `UPDATE assets SET isEnable = 0 WHERE id = ?`,
                [this.id]
            );

            if (this.hasChildren) {
                await connection.query(
                    `UPDATE assets SET isEnable = 0 WHERE parentAssetId = ?`,
                    [this.id]
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

    async editAsset(data, who) {

        if (data instanceof AssetDraft) {
            data = data.toPlainData();
        }

        const { error, value } = assetSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        if (!this.id) {
            throw new Error("Asset not found");
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            this.isEnable = true;
            this.lastUpdateBy = who;

            this.categoryIds = value.categoryIds;

            this.draftId = value.draftId;
            this.hasChildren = value.hasChildren;
            this.parentAssetId = value.parentAssetId;
        
            this.name = value.name;
            this.description = value.description;
            this.isVolunOpp = value.isVolunOpp;
            this.volunOppText = value.volunOppText;

            this.scheduleType = value.scheduleType;
            this.registrationNote = value.registrationNote;
            this.scheduleNote = value.scheduleNote;
            this.socialWorkerOnlyNote = value.socialWorkerOnlyNote;
            this.isWheelchairAcc = value.isWheelchairAcc;

            this.address.cityName = value.cityName;
            this.address.address = value.address;
            this.address.postCode = value.postCode;
            this.address.longitude = value.longitude;
            this.address.latitude = value.latitude;
            this.address.transportation = value.transportation;

            this.contactInfo.phoneNumber = value.phoneNumber;
            this.contactInfo.email = value.email;
            this.contactInfo.website = value.website;

           
            const addressData = this.address.toDatabaseFormat();
            const contactData = this.contactInfo.toDatabaseFormat();
            const languagesOffered = this.languagesOffered?.length ? this.languagesOffered.join('|') : null;
            const format = this.format?.length ? this.format.join('|') : null;

            await connection.query(
                `UPDATE assets SET 
                    isEnable = ?, lastUpdateBy = ?,
                    draftId = ?, hasChildren = ?, parentAssetId = ?,
                    name = ?, description = ?,isVolunOpp = ?, volunOppText = ?,
                    scheduleType = ?, registrationNote = ?, scheduleNote = ?, socialWorkerOnlyNote = ?, isWheelchairAcc = ?,
                    cityCode = ?, address = ?, postCode = ?, longitude = ?, latitude = ?, transportation = ?,
                    phoneNumber = ?, email = ?, website = ?,
                    languagesOffered = ?, format = ?
                WHERE id = ?`,
                [ this.isEnable, this.lastUpdateBy,
                    this.draftId, this.hasChildren, this.parentAssetId,
                    this.name, this.description, this.isVolunOpp, this.volunOppText,
                    this.scheduleType, this.registrationNote, this.scheduleNote, this.socialWorkerOnlyNote, this.isWheelchairAcc,
                    addressData.cityCode, addressData.address, addressData.postCode, addressData.longitude, addressData.latitude, addressData.transportation,
                    contactData.phoneNumber, contactData.email, contactData.website,
                    languagesOffered, format,
                    this.id]
            );

            await connection.query(`DELETE FROM assetCategLinks WHERE assetId = ?`, [this.id]);
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
