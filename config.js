require('dotenv').config();

const Port = process.env.PORT;
const URL = process.env.ORIGINURL
const KEY =  process.env.JWT_KEY
const DB = process.env.DATABASEURL


module.exports ={ Port , URL , KEY , DB}