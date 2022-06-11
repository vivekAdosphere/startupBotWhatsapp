const config = require("../config/config");

const server_URL = config.serverUrl;

module.exports = {
    //Greetings
    initiateConversationMessages: ["hi", "Hi", "Hello", "hii", "HI", "hello", "hey", "Hey", "HEY", "HELLO"],
    Yes: ["Yes", "yes", "1"],
    No: ["No", "no", "2"],
    welcomeMessage: "Hello this bot can evaluate your starups credentials for registeration",

    welcomeMessageForStakeHolder: "",

    //Questions
    askForUserProfile: "Select Your profile",
    askForName: "What is your full name?",
    askForDin: "What is your DIN(Directors indentification number)?",
    askForIdProof: "Please upload your id proof (Voter id/Driving License/Passport)",
    askForCompanyName: "What is your company name?",
    askForPanCard: "Please send Your PanCard image",
    askForEmail: "What is your email Id ?",
    askForNumber: "What is your registered mobile number",
    askForAddressProof: "Please upload an image of company's address proof..",
    askForNoc: "Please upload registered company's NOC image",
    askForCompanyShare: "For which company ,you want share?",
    updateData: "Do you want to update the existing details?\n 1.Yes\n 2.No",

    //thank you message
    thankYouMessageForStakeHolder: "Thank you for submitting valid documents and details for registering your business,\n we will evaluate this details and inform you soon",
    thankYouMessageForShareHolder: "Thank You for your response,\n we will evaluate your details,\n and will notify you soon.",


    //fallbacks
    somethingWentWrong: "Oops! Something went wrong! Please reinitiate the process using 'hi' or 'hello'",
    errorMessage: "Invalid Input. Please type 'hi' or 'hello' to initiate the process.",
    errorForImage: "Invalid input, Please send image not a text",
    attachmentWarning: "Invalid input,please try again with text",
    invalidName: "Invalid name,Please try again!",
    invaliddin: "Invalid format of DIN, please try again!",
    invalidCompanyName: "Invalid company name,Please try again!",
    invalidEmail: "Invalid Email,please try again!",
    invalidNumber: "Invalid Number,Please try again!",
    invalidInput: "Invalid Input,Please try again!"

}