const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
    title: { type : String , required : true , unique : true  },
    description: { type : String , required : true},
    price: { type : String , required : true},
    quantity: {type : Number , required : true},
    image: {type : String },
    createdAt: {type : Date },
    categoryId: {type : String , required : true}
})

module.exports = mongoose.model("product" , productSchema);