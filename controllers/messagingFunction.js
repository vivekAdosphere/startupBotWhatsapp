const { MapToLocal } = require("../functionality/mapToLocal");
const mapNames = require("../config/mapNames");
const languageChooser = require("../language/languageChooser");
const { sendTextMessage, sendListMessage } = require("../functionality/messageSender")
const logger = require("../functionality/logger")
const { clearFlags, getCurrentTime, isValidDate } = require("../functionality/utilities")
const validator = require('validation-master');
const {
    checkIfUserRegistered,
    saveUserDetail,
    updateUser
} = require("../functionality/service");
const config = require("../config/config")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const userData = new MapToLocal(mapNames.userData)
const fs = require('fs')
const Path = require('path');
const axios = require('axios')

//flagupdator
let userDataFlagHandler = (number, key, value) => {

    let dictValues = userData.get(number, value)
    dictValues[key] = value
    userData.set(number, dictValues)
    return;
}


let initDefaultValues = (number, index) => {
    flowPathIndicator.set(number, index)
    userData.set(number, {})
}



//(((((((((((FirstStep)))))))))))
//if we initiate conversation with hi or hello or whatever is there in initconversationMessage then this function call
//this function run initially in handleTextMessgae function at messageHandler.js file
//here we recieve TEXT
exports.introductionHandler = async(number) => {
    try {
        clearFlags(number)
        await sendTextMessage(number, languageChooser(number).welcomeMessage)
        await sendListMessage(number, languageChooser(number).askForUserProfile)
            //set flowpath to 1 for call next function
        initDefaultValues(number, "1")
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//now flowPath is set to 1 so,next method is to handle userProfile
//here we recieve INTERACTIVE MESSAGE
exports.profileHandler = async(number, message) => {
    try {
        //if we recieve user selection and user have selected stakeHolder(id=1) then askforname and update flowPath
        if (message === "id1") {
            await sendTextMessage(number, languageChooser(number).askForDin)
            flowPathIndicator.set(number, "2")
        } else if (message === "id2") {
            await sendTextMessage(number, languageChooser(number).askForName)
            flowPathIndicator.set(number, "shareholder")
        } else {
            //if user doesnt select any profile and input something then send again userProfile
            await sendListMessage(number, languageChooser(number).askForUserProfile)
            flowPathIndicator.set(number, "1")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 2 so that we have to handle din
//here we recieve TEXT
//in this function we have to check that if the user have already registered or not
//if user is registered then we have to update the flowpath accordingly and create a function to handle it


exports.dinHandler = async(number, message) => {
    try {

        //we have to validate din and update flowpath to 3
        if (validator.isNumeric(message)) {
            userDataFlagHandler(number, "din", message)
                //check user is already registered or not
            const registeredUser = await checkIfUserRegistered({ "UserInfo.din": userData.get(number).din })

            //data  ==> update 
            if (registeredUser !== null) {
                await sendTextMessage(number, languageChooser(number).updateData)
                flowPathIndicator.set(number, "updatedUser")
            } else {
                //save user in database
                await saveUserDetail({ UserInfo: { din: userData.get(number).din } })
                await sendTextMessage(number, languageChooser(number).askForName)
                flowPathIndicator.set(number, "3")
            }


        } else {
            await sendTextMessage(number, languageChooser(number).invaliddin)
            flowPathIndicator.set(number, "2")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}


//if user have already registered with given DIN then we have to handle that in this function
//for updated user the flowpath is set to updatedUser
exports.existingUserHandler = async(number, message) => {
    try {
        if (languageChooser(number).Yes.includes(message)) {
            await sendTextMessage(number, languageChooser(number).askForName);
            flowPathIndicator.set(number, "3")
        } else if (languageChooser(number).No.includes(message)) {
            await sendTextMessage(number, languageChooser(number).thankYouMessageForStakeHolder)
            clearFlags(number)
        } else {
            await sendTextMessage(languageChooser(number).invalidInput);
            flowPathIndicator.set(number, "updatedUser")

        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}





//if we have recieve profile selection for stakeholder then askForNameForstakeHolder
//here we handler this function for flowpath =3
//here we recieve TEXT

exports.nameHandlerForStakeHolder = async(number, message) => {

    try {
        //we validate if given message is alphabetic or not is have then flowpath=4
        if (validator.isAlphabetic(message)) {
            userDataFlagHandler(number, "stakeholderName", message)
            await updateUser({ "UserInfo.din": userData.get(number).din }, { "UserInfo.stakeholderName": userData.get(number).stakeholderName });
            await sendTextMessage(number, languageChooser(number).askForCompanyName)
            flowPathIndicator.set(number, "4")

        } else {
            await sendTextMessage(number, languageChooser(number).invalidName)
            flowPathIndicator.set(number, "3")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}


//flowpath == 4 & we have recived din of user now handle company name
//here we recieve TEXT

exports.companyNameHandlerForStakeHolder = async(number, message) => {
    try {
        //validate company name and update flow path to 5
        if (validator.isAlphabetic(message)) {
            userDataFlagHandler(number, "companyName", message)
            await updateUser({ "UserInfo.din": userData.get(number).din }, { "companyInfo.companyName": userData.get(number).companyName })
            await sendTextMessage(number, languageChooser(number).askForPanCard)
            flowPathIndicator.set(number, "5")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidCompanyName)
            flowPathIndicator.set(number, "4")
        }

    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 5 handle pan card for stakeholder
//here we recieve IMAGE as a message
exports.panCardHandlerForStakeHolder = async(number, message) => {
    try {

        const saveImage = async(message) => {
            try {
                const url = `${config.API_BASE_URL}/media/${message}`

                const path = Path.resolve(__dirname, 'public', public.jpeg)
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
        saveImage(message)

        userDataFlagHandler(number, "panCard", message)
        await updateUser({ "UserInfo.din": userData.get(number).din }, { "UserInfo.panCard": userData.get(number).panCard })
        await sendTextMessage(number, languageChooser(number).askForIdProof)
        flowPathIndicator.set(number, "6")

    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 6 now we have to handle id proof for stake holder
//here we recieve IMAGE as a message

exports.idProofHandlerForStakeHolder = async(number, message) => {
    try {
        userDataFlagHandler(number, "idProof", message)
        await updateUser({ "UserInfo.din": userData.get(number).din }, { "UserInfo.idProof": userData.get(number).idProof })
        await sendTextMessage(number, languageChooser(number).askForEmail)
        flowPathIndicator.set(number, "7")
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 7 and we have to handle email for stakeholder
//and update flowpath to 8
//here we recieve TEXT as a message
exports.emailHandlerForStakeHolder = async(number, message) => {
    try {
        //if given message to the function is email then ask for number and update the flowpath t0 8
        if (validator.emailValidator(message)) {
            userDataFlagHandler(number, "email", message)
            await updateUser({ "UserInfo.din": userData.get(number).din }, { "UserInfo.email": userData.get(number).email })
            await sendTextMessage(number, languageChooser(number).askForNumber);
            flowPathIndicator.set(number, "8")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidEmail)
            flowPathIndicator.set(number, "7")
        }

    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is  set to 8 and now we have to handle company address proof
//and update flowpath to 9
//here we recieve TEXT as a message

exports.numberHandlerForStakeHolder = async(number, message) => {
    try {
        //validate users number and update the flowpath to 9
        if (validator.isNumeric(message)) {
            userDataFlagHandler(number, "number", message)
            await updateUser({ "UserInfo.din": userData.get(number).din }, { "UserInfo.mobileNumber": userData.get(number).number })
            await sendTextMessage(number, languageChooser(number).askForAddressProof)
            flowPathIndicator.set(number, "9")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidNumber)
            flowPathIndicator.set(number, "8")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath= 9 and we have to handle stake holders company addressproof
//and update the flowpath to 10
//here we recieve IMAGE as a message

exports.companyAddressProofHandler = async(number, message) => {
    try {
        userDataFlagHandler(number, "addressProof", message)
        await updateUser({ "UserInfo.din": userData.get(number).din }, { "companyInfo.addressProof": userData.get(number).addressProof })
        await sendTextMessage(number, languageChooser(number).askForNoc)
        flowPathIndicator.set(number, "10")
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//now we have flowpath at 10 and we have the noc
//so we have all the details from stakeholder so we have to end the flow here
//and send thank you message
//here we recieve IMAGE as a message
exports.nocHandler = async(number, message) => {
    try {
        userDataFlagHandler(number, "noc", message)
        await updateUser({ "UserInfo.din": userData.get(number).din }, { "companyInfo.noc": userData.get(number).noc })
        await sendTextMessage(number, languageChooser(number).thankYouMessageForStakeHolder)
        clearFlags(number)
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}


//------>>>>>>>((((((((((((END OF STAKEHOLDER FLOW))))))))))))<<<<<<<------


//------>>>>>>>((((((((((((START OF SHAREHOLDER FLOW))))))))))))<<<<<<<--------

// if we recieve id2 from profile handler function 
// then we have to use call this function as a given flowpath
// this function recieves TEXT as a messages

exports.nameHandlerForShareHolder = async(number, message) => {
    try {
        if (validator.isAlphabetic(message)) {
            await sendTextMessage(number, languageChooser(number).askForCompanyName)
            flowPathIndicator.set(number, "12")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidName)
            flowPathIndicator.set(number, "shareholder")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 12
//now we have to handle company name for shareholder
//this function takes TEXT as a message

exports.companyNameHandlerForShareHolder = async(number, message) => {
    try {
        //we have to validate a given message is a type of name ,and then update the flowpath to 13
        if (validator.isAlphabetic(message)) {
            await sendTextMessage(number, languageChooser(number).askForPanCard)
            flowPathIndicator.set(number, "13")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidCompanyName);
            flowPathIndicator.set(number, "12")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//flowpath is set to 13 now we have to handle pan card for shareholder
//this functions takes IMAGE as a message


exports.panCardHandlerForShareHolder = async(number, message) => {
    try {
        await sendTextMessage(number, languageChooser(number).askForEmail);
        flowPathIndicator.set(number, "14")

    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//now flowpath is set to 14 so we have to handle email for shareholder
//this function takes TEXT as a message

exports.emailHandlerForShareHolder = async(number, message) => {
    try {
        //we have to first validate that given message is email or not
        //if we recieve email then update the flowpath is set to 15
        if (validator.emailValidator(message)) {
            await sendTextMessage(number, languageChooser(number).askForNumber)
            flowPathIndicator.set(number, "15")
        } else {
            await sendTextMessage(number, languageChooser(number).invalidEmail)
            flowPathIndicator.set(number, "14")
        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}

//now the flowpath is set to 15 so we have to handle number for shareholder
//this function takes TEXT as a message

exports.numberHandlerForShareHolder = async(number, message) => {
    try {
        //if number is validated then just show a thank you message
        if (validator.isNumeric(message)) {
            await sendTextMessage(number, languageChooser(number).thankYouMessageForShareHolder)
            clearFlags(number)
        } else {
            await sendTextMessage(number, languageChooser(number).invalidNumber)
            flowPathIndicator.set(number, "15")

        }
    } catch (err) {
        logger.error(`Error, ${languageChooser(number).somethingWentWrong}`);
        clearFlags(number)
    }
}