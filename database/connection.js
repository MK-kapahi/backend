const mongoose = require("mongoose");
const { DB } = require("../config");


const mongoDB = new Promise((resolve, reject) => {
    mongoose.connect(DB).then(connected => {
        resolve(connected);
    }).catch(connectionError => {
        reject(connectionError);
    });
});
module.exports = mongoDB;