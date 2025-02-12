const db = require('../db');
const util = require('util');
const validator = require('validator');
const Joi = require('joi');

const queryAsync = util.promisify(db.query).bind(db);

class Category {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.jobTitle = data.jobTitle;
        this.password = data.password;
        this.isEnable = data.isEnable instanceof Buffer ? Boolean(value.isEnable.readUInt8(0)) : value.isEnable;
        this.createdBy = data.createdBy;
        this.createDate = data.createDate;
        this.lastUpdateBy = data.lastUpdateBy;
        this.lastUpdateDate = data.lastUpdateDate;
    }
}