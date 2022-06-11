const Company = require("../models/companyRegisteraton");
const logger = require("../functionality/logger");
var fs = require("fs");
const axios = require('axios')
const path = require('path')

exports.checkIfUserRegistered = async({ "UserInfo.din": din }) => {
    try {
        console.log("givem message is :" + din)
        let data = await Company.findOne({ "UserInfo.din": din })
        console.log("You have received data as ", data)
        return data

    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

// exports.saveUserDetail = async({
//     "UserInfo.din": din,
//     "UserInfo.mobileNumber": dataOfUser
// }) => {
//     try {

//         // console.log("save user " + message)
//         console.log("From saveUser " + din)
//         console.log(dataOfUser)
//         await Company.create({ din, dataOfUser })
//         return true
//     } catch (err) {
//         console.log(err);
//         logger.error(`DB Fetch Error  from saving---> ${JSON.stringify(err)}`)
//         return false
//     }
// }

exports.saveUserDetail = async(dataObject) => {
    try {
        console.log(dataObject)
        const user = await Company.create(dataObject)

    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}

exports.updateUser = async(keyObject, dataObject) => {
    try {
        console.log(keyObject, dataObject)
        let data = await Company.updateOne(keyObject, dataObject)
        console.log(data)
        return data
    } catch (err) {
        logger.error(`DB Fetch Error from updating---> ${JSON.stringify(err)}`)
        return false
    }
}


const saveImage = async() => {
    try {
        const url = 'https://unsplash.com/photos/0JvPZCDMrgs/download?force=true'

        const path = path.resolve(__dirname, 'public', public.jpeg)
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        })

        response.data.pipe(fs.createWriteStream(path))

        return new Promise((resolve, reject) => {
            response.data.on("end", () => {
                resolve()
            })

            response.data.on("error", (err) => {
                reject(err)
            })
        })
    } catch (err) {
        logger.error(`DB Fetch Error from updating---> ${JSON.stringify(err)}`)
        return false
    }
}

saveImage();