const mongoose  = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street:     {type:String},
        country:    {type:String},
        city:       {type:String},
        province:   {type:String},
        region:     {type:String},
        postcode:   {type:String},
        phone:      {type:String}
        
    },
    orders: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
         }]
})

const Client = mongoose.model('Client',clientSchema)

module.exports=Client


