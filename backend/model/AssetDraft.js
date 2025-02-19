const db = require('../db');
const validator = require('validator');
const Joi = require('joi');

const assetSchema = Joi.object({
});

class AssetDraft {
    constructor(data) {
        const { error, value } = assetSchema.validate(data); // You would create a schema like userSchema for validation
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

        this.id = value.id;
        this.assetId = value.draftId;
        this.mainAssetId = value.mainAssetId;
        this.name = value.name;
        this.province = value.province;
        this.city = value.city;
        this.address = value.address;
        this.postCode = value.postCode;
        this.longitude = value.longitude;
        this.latitude = value.latitude;
        this.isVolunOpp = value.isVolunOpp instanceof Buffer ? Boolean(value.isVolunOpp.readUInt8(0)) : value.isEnable;
        this.volunOppText = value.volunOppText;
        this.phoneNumber = value.phoneNumber;
        this.email = value.email;
        this.website = value.website;
        this.isAccessibility = value.isAccessibility;
        this.isWheelchirAcc = value.isWheelchirAcc;
        this.languagesOff = value.languagesOff;
        this.scheduleType = value.scheduleType;
        this.volunteerNote = value.volunteerNote;
        this.registrationNote = value.registrationNote;
        this.scheduleNote = value.scheduleNote;
        this.socialWorkerNote = value.socialWorkerNote;
        this.description = value.description;
        this.isEnable = value.isEnable instanceof Buffer ? Boolean(value.isEnable.readUInt8(0)) : value.isEnable;
        this.createdEmail = 
        this.createdBy = value.createdBy;
        this.createDate = value.createDate;
        this.lastUpdateBy = value.lastUpdateBy;
        this.lastUpdateDate = value.lastUpdateDate;
    }

    'CREATE TABLE `AssetsDraft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetId` int DEFAULT NULL COMMENT ''reference to forma, just for updatel'',
  `name` varchar(255) NOT NULL COMMENT ''asset name'',
  `province` varchar(5) NOT NULL COMMENT ''asset location province'',
  `city` varchar(5) DEFAULT NULL COMMENT ''asset location city'',
  `address` varchar(500) DEFAULT NULL COMMENT ''asset location address'',
  `postCode` varchar(10) DEFAULT NULL COMMENT ''asset postcode'',
  `longitude` varchar(50) DEFAULT NULL COMMENT ''longitude'',
  `latitude` varchar(50) DEFAULT NULL COMMENT ''latitude'',
  `isVolunOpp` bit(1) DEFAULT NULL COMMENT ''if is volunteer Oppoetunities'',
  `volunOppText` varchar(100) DEFAULT NULL COMMENT '' volunteer Oppoetunities remark'',
  `phoneNumber` varchar(500) DEFAULT NULL COMMENT ''contractor phoneNumbe'',
  `email` varchar(500) DEFAULT NULL COMMENT ''contractor email'',
  `website` varchar(500) DEFAULT NULL COMMENT ''website url'',
  `isAccessibility` bit(1) DEFAULT NULL COMMENT ''if has Accessibility'',
  `isWheelchirAcc` bit(1) DEFAULT NULL COMMENT ''if has wheelchair Accessibility'',
  `languagesOff` varchar(5) DEFAULT NULL COMMENT ''languages offered option(englis/franch/Bilingual)'',
  `scheduleType` varchar(5) DEFAULT NULL,
  `volunteerNote` varchar(500) DEFAULT NULL,
  `registrationNote` varchar(500) DEFAULT NULL,
  `scheduleNote` varchar(500) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL COMMENT ''remark'',
  `type` varchar(5) DEFAULT NULL COMMENT ''create;update'',
  `status` varchar(5) DEFAULT NULL COMMENT ''Pending; Approved; Rejectedt'',
  `createdEmail` varchar(100) DEFAULT NULL COMMENT ''created by user(email)'',
  `createDate` datetime DEFAULT NULL COMMENT ''create date'',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=''asset table, include all kind of asset: facility, service, p'''
    static formatAssetDetails(assetData) {
        // similar to formatUserDetails
        return assetData;
    }

    static async create({ draftId, mainAssetId, name, province, city, address, postCode, longitude, latitude, isVolunOpp, volunOppText, phoneNumber, email, website, isAccessibility, isWheelchirAcc, languagesOff, scheduleType, volunteerNote, registrationNote, scheduleNote, socialWorkerNote, description, isEnable, createdBy }) {
        try {
            // Validate the data
            const { error, value } = assetSchema.validate({ draftId, mainAssetId, name, province, city, address, postCode, longitude, latitude, isVolunOpp, volunOppText, phoneNumber, email, website, isAccessibility, isWheelchirAcc, languagesOff, scheduleType, volunteerNote, registrationNote, scheduleNote, socialWorkerNote, description, isEnable });
            if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);

            // Insert into the database
            const query = `
                INSERT INTO Assets (
                    draftId, mainAssetId, name, province, city, address, postCode, longitude, latitude, 
                    isVolunOpp, volunOppText, phoneNumber, email, website, isAccessibility, isWheelchirAcc, 
                    languagesOff, scheduleType, volunteerNote, registrationNote, scheduleNote, socialWorkerNote, 
                    description, isEnable, createdBy, createDate
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [
                value.draftId, value.mainAssetId, value.name, value.province, value.city, value.address, 
                value.postCode, value.longitude, value.latitude, value.isVolunOpp, value.volunOppText, 
                value.phoneNumber, value.email, value.website, value.isAccessibility, value.isWheelchirAcc, 
                value.languagesOff, value.scheduleType, value.volunteerNote, value.registrationNote, 
                value.scheduleNote, value.socialWorkerNote, value.description, value.isEnable, 
                value.createdBy, value.createDate || new Date()
            ]);

            return await Asset.findById(result.insertId);
        } catch (err) {
            throw new Error(`Error creating asset: ${err.message}`);
        }
    }

    static async findById(assetId) {
        try {
            assetId = Number(assetId);
            if (!assetId || isNaN(assetId)) throw new Error("Invalid asset ID");

            const query = `
                SELECT * 
                FROM Assets
                WHERE id = ?
            `;
            const [results] = await db.query(query, [assetId]);
            if (!results.length) return null;
            
            return new Asset(results[0]);
        } catch (err) {
            throw new Error(`Error finding asset by ID: ${err.message}`);
        }
    }


}

module.exports = AssetDraft;