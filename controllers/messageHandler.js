const languageChooser = require("../language/languageChooser")
const { MapToLocal } = require("../functionality/mapToLocal");
const mapNames = require("../config/mapNames")
const { sendTextMessage, sendListMessage } = require("../functionality/messageSender")
const config = require("../config/config")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator)
const {
    introductionHandler,
    profileHandler,
    nameHandlerForStakeHolder,
    dinHandler,
    companyNameHandlerForStakeHolder,
    panCardHandlerForStakeHolder,
    idProofHandlerForStakeHolder,
    companyAddressProofHandler,
    emailHandlerForStakeHolder,
    numberHandlerForStakeHolder,
    nocHandler,
    nameHandlerForShareHolder,
    companyNameHandlerForShareHolder,
    panCardHandlerForShareHolder,
    emailHandlerForShareHolder,
    numberHandlerForShareHolder,
    existingUserHandler
} = require("../controllers/messagingFunction")

const logger = require("../functionality/logger")
const { clearFlags } = require("../functionality/utilities");

let req = {
    headers: {
        'Content-Type': 'image/jpeg',
        'Authorization': "jJm2ySljUFGIRXsfmduoZpEoAK"
    },
    encoding: 'binary'
}

exports.handleTextMessage = async(number, message) => {
    try {
        if (languageChooser(number).initiateConversationMessages.includes(message)) {
            introductionHandler(number, message)
        } else if (flowPathIndicator.has(number)) {
            switch (flowPathIndicator.get(number)) {
                case "1":
                    profileHandler(number, message)
                    break
                case "2":
                    dinHandler(number, message)
                    break
                case "3":
                    nameHandlerForStakeHolder(number, message)
                    break
                case "4":
                    companyNameHandlerForStakeHolder(number, message)
                    break
                case "5":
                    sendTextMessage(number, languageChooser(number).errorForImage)
                    break
                case "6":
                    sendTextMessage(number, languageChooser(number).errorForImage)
                    break
                case "7":
                    emailHandlerForStakeHolder(number, message)
                    break
                case "8":
                    numberHandlerForStakeHolder(number, message)
                    break
                case "9":
                    sendTextMessage(number, languageChooser(number).errorForImage)
                    break
                case "10":
                    sendTextMessage(number, languageChooser(number).errorForImage)
                    break
                case "shareholder":
                    nameHandlerForShareHolder(number, message)
                    break
                case "12":
                    companyNameHandlerForShareHolder(number, message)
                    break
                case "13":
                    sendTextMessage(number, languageChooser(number).errorForImage)
                    break
                case "14":
                    emailHandlerForShareHolder(number, message)
                    break
                case "15":
                    numberHandlerForShareHolder(number, message)
                    break
                case "updatedUser":
                    existingUserHandler(number, message)
                    break
                default:
                    sendTextMessage(number, languageChooser(number).somethingWentWrong)
            }
        }
    } catch (err) {
        logger.error(`Error,${languageChooser(number).somethingWentWrong}`)
        clearFlags(number)
    }
}


// exports.handleInteractiveMessage = async(number, message) => {
//     try {
//         if (message === "id1") {
//             profileHandlerStakeHolder(number, message)
//         } else if (message === "id2") {
//             profileHandlerShareHolder(number, message)
//         } else {
//             await sendTextMessage(number, languageChooser(number).errorMessage)

//         }
//     } catch (err) {
//         logger.error(`Error,${languageChooser(number).somethingWentWrong}`)
//         clearFlags(number)
//     }
// }

exports.handleImageMessage = async(number, message) => {
    try {
        if (flowPathIndicator.has(number)) {
            switch (flowPathIndicator.get(number)) {
                case "1":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "2":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "3":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "4":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "5":
                    panCardHandlerForStakeHolder(number, message.id)
                    console.log(message)
                    break
                case "6":
                    idProofHandlerForStakeHolder(number, message.id)
                    break
                case "7":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "8":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "9":
                    companyAddressProofHandler(number, message.id)
                    break
                case "10":
                    nocHandler(number, message.id)
                    break
                case "shareholder":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "12":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "13":
                    panCardHandlerForShareHolder(number, message.id)
                    break
                case "14":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "15":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                case "updatedUser":
                    sendTextMessage(number, languageChooser(number).attachmentWarning)
                    break
                default:
                    sendTextMessage(number, languageChooser(number).somethingWentWrong)
            }
        }
    } catch (err) {
        logger.error(`Error,${languageChooser(number).somethingWentWrong}`)
        clearFlags(number)
    }
}