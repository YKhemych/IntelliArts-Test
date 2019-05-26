const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {type: String},
    date: {type: Date},
    price: {type: Number},
    currency: {type: String}
});

module.exports = mongoose.model('Product', productSchema);