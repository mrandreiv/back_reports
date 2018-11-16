const mongoose = require('mongoose')


const changelogSchema = new mongoose.Schema({
    orderId:{type:String},
    who:    {type:String},
    when:   {type:Date},
    what:   {
            oldValue:{type:Object},
            newValue:{type:Object}
            }
})

const ChangeLog = mongoose.model('ChangeLog',changelogSchema)

module.exports=ChangeLog
