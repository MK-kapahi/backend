const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    city : {type : String , required :true },
    country : {type : String , required : true},
    line1 : {type : String },
    line2 : { type : String },
    postalCode: { type: Number },
    state : {type : String },
    userId : {type : String},
    createdAt : {type : Date}
})

module.exports = mongoose.model("shippingAddress" , addressSchema);