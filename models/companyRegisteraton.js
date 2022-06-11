const mongoose = require('mongoose');


const companyRegisterationSchema = new mongoose.Schema({
    UserInfo: {
        din: {
            type: String,
            unique: true,
            required: true,
            sparse: true
        },
        stakeholderName: {
            type: String,
            trim: true,
            required: false,
            default: "null"

        },
        panCard: {
            data: Buffer,
            contentType: String,
            required: false

        },
        idProof: {
            data: Buffer,
            contentType: String,
            required: false

        },
        email: {
            type: String,
            default: "null",
            required: false
        },
        mobileNumber: {
            type: String,
            default: "null",
            required: true
        },
    },

    companyInfo: {
        companyName: {
            type: String,
            trim: true,
            default: "null",
            required: false
        },
        addressProof: {
            data: Buffer,
            contentType: String,
            required: false
        },
        noc: {
            data: Buffer,
            contentType: String,
            required: false
        }

    }




}, { timestamps: true })

module.exports = mongoose.model('Company', companyRegisterationSchema)