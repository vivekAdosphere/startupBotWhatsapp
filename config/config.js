require('dotenv').config();

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    API_BASE_URL: process.env.API_BASE_URL,
    SERVER_URL: (process.env.DEBUG).toLowerCase() === "true" ? (process.env.LOCAL_SERVER_URL).toLowerCase() : (process.env.PRODUCTION_SERVER_URL).toLowerCase(),
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN
}