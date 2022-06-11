const axios = require("axios");

//local dependencies
const logger = require("../functionality/logger");
const config = require("../config/config");

const apiKey = config.ACCESS_TOKEN

const headers = {
    'D360-Api-Key': apiKey,
    'Content-Type': "application/json",
}


const serverUrl = config.SERVER_URL
const baseApiUrl = config.API_BASE_URL


//send text message to whatsapp number
exports.sendTextMessage = async(number, message) => {
    try {
        const payload = {
            "to": number,
            "type": "text",
            "text": {
                "body": message
            }
        }

        const res = await axios.post(baseApiUrl + "/messages", payload, { headers })
        return res.data
        console.log(res.data)

    } catch (err) {
        logger.error(`Error,${JSON.stringify(err.response.data)}`);
        console.log(err)
        return err.response.data
    }
}

//send document file
exports.sendDocumentFile = async(number, certificateId, filename) => {
    try {
        const payload = {
            "recipient_type": "individual",
            "to": number,
            "type": "document",
            "document": {
                "id": certificateId,
                "filename": filename
            }
        }
        const res = await axios.post(baseApiUrl + "/messages", payload, { headers });
        return res.data

    } catch (err) {
        logger.error(`Error,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

exports.sendListMessage = async(number, message) => {
    try {
        const payload = {

            "recipient_type": "individual",
            "to": number,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {
                    "type": "text",
                    "text": message
                },
                "body": {
                    "text": "You have two options"
                },
                "footer": {
                    "text": "Please select to proceed"
                },
                "action": {
                    "button": "Open profile options",
                    "sections": [{
                            "title": "Option 1",
                            "rows": [{
                                "id": "id1",
                                "title": "StakeHolder",
                                "description": "StakeHolder can register startup"
                            }]
                        },
                        {
                            "title": "Option 2",
                            "rows": [{
                                "id": "id2",
                                "title": "ShareHolder",
                                "description": "Share Holder can take share of a comapny"
                            }]
                        }

                    ]
                }



            }
        }
        const res = await axios.post(baseApiUrl + "/messages", payload, { headers });
        return res.data

    } catch (err) {
        logger.error(`Error, ${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

//to send template message to number
exports.sendTempelateMessage = async(number, message) => {
    try {
        const payload = {
            "recipient_type": "individual",
            "to": number,
            "type": "template",
            "template": {
                "namespace": namespaceId,
                "name": template[0],
                "language": {
                    "code": template[1],
                    "policy": "deterministic"
                }
            }
        }
        const res = await axios.post(baseApiUrl + "/messages", payload, { headers });
        return res.data

    } catch (err) {
        logger.error(`Error,${JSON.stringify(err.response.data)}`)
        return err.response.data
    }
}


//send image file to number
exports.sendImageFile = async(userName, number, imageLink, imageType = "question") => {
    try {
        const payload = {
            "recipient_type": "individual",
            "to": number,
            "type": "image",
            "image": {
                "link": imageLink
            }
        }

        let res = await axios.post(baseApiUrl + "/messages", payload, { headers })

        if (imageType !== "question") {
            setTimeout(() => {
                fs.unlink(path.join(__dirname, "../", "public", "file", userName.replace(/\s+/g, '-') + "-" + number + ".jpg"), async function(err) {
                    if (err) {
                        logger.error(`Error, Unable to delete image file. -> ${err}`);
                    } else {
                        logger.info(`Success, Image file deleted successfully.`);
                    }
                })
            }, 4000)
        }

    } catch (err) {
        logger.error(`Error,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

exports.webhookValidator = async() => {
    try {
        const payload = {
            "url": serverUrl + "/webhook"
        }

        const res = await axios.post(baseApiUrl + "/configs/webhook", payload, { headers });
        logger.info(`Success,Webhook Set Successfully`)

        return res.data

    } catch (err) {
        logger.error(`Error,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}