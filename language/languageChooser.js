const { MapToLocal } = require("../functionality/mapToLocal")
const mapNames = require("../config/mapNames")
const english = require("./english");
const hindi = require("./hindi")

const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage)

module.exports = (senderId) => {
    if (selectedCommunicationLanguage.has(senderId) && selectedCommunicationLanguage.get(senderId) === "1") {
        return english
    } else if (selectedCommunicationLanguage.has(senderId) && selectedCommunicationLanguage.get(senderId) === "2") {
        return hindi
    } else {
        return english
    }
}