const mongoose = require('mongoose')
mongoose.set('debuer', true)
mongoose.Promise = Promise

mongoose.connect('mongodb://localhost/eshop_crm')

module.exports.Client = require('./client')
module.exports.Order = require('./order')
// module.exports.Message = require('./message')
