var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({

    title: { type: String, required: true },
    slug: { type: String },
    dateCreated: { type: String },
    description: { type: String, required: true},
    category: { type: String, required: true},
    price: { type: Number, required: true},
    image: { type: String, required: true}
    
})

var Product = module.exports = mongoose.model('Product', ProductSchema);