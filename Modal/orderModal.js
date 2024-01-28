const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    product : {type : Array , required :true },
    userId : {type : String , required : true},
    orderStatus : {type : String },
    paymentStatus : { type : String },
    createdAt: { type: Date },
    updatedAt : {type : Date },
})

module.exports = mongoose.model("Order" , orderSchema);