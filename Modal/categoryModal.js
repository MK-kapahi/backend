const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    categoryName: { type: String, unique: true },
    createdAt: { type: Date }
})

module.exports = mongoose.model("category" , categorySchema);
