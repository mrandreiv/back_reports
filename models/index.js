const mongoose = require('mongoose')
mongoose.set('debuger', true)
mongoose.Promise = Promise

mongoose.connect('mongodb://localhost/eshop_crm', {useNewUrlParser: true})

module.exports.Client = require('./client')
module.exports.Order = require('./order')
module.exports.ChangeLog = require('./changelog')
// module.exports.Message = require('./message')
