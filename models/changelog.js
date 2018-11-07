const mongoose = require('mongoose')

const changelogSchema = new mongoose.Schema({
    orderId:{type: Schema.Types.ObjectId, ref:'Order'},
    who:{type:String},
    when:{type:Date},
    what:{type:Object}
})

const ChangeLog = mongoose.model('ChangeLog',changelogSchema)

module.exports=ChangeLog
