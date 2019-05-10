var mongoose = require('mongoose');

var PageSchema = mongoose.Schema({

    title: { type: String, required: true },
    slug: { type: String },
    dateCreated: { type: String },
    content: { type: String}
})

var Page = module.exports = mongoose.model('Page', PageSchema);