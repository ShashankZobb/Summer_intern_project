require("dotenv").config();


const PORT = process.env.PORT || 5000;
const USER = process.env.USER || "root";
const PASSWORD = process.env.PASSWORD || "";
const DATABASE = process.env.DATABASE || 'summer_project';

module.exports = {
    PORT,
    USER,
    PASSWORD,
    DATABASE
}