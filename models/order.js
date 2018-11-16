const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderNr:{type:String},
    status:{type:String},
    client: {name:String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Client",
            },
    affil:{type:String},
    
    finance:{
        invoiced:{type: Boolean},
        invoice:{type:String},
        creditNote:{type:String}  
    },
    
    items:[{
        sku:{type:String},
        name:{type:String},
        description:{type: String},
        quantity:{type:Number},
        price:{type:Number}
    }],
   
    amount:{
        amountIn:{type: Number},
        amountOut:{type: Number},
        },
    shipping:{  
        deliveryDate:{type:Date},
        trackingNr:{type:String},
        shippingCost:{type:Number},

        shipFrom:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company",
        },
        shipTo:{
                street:     {type:String},
                streetNr:     {type:String},
                country:    {type:String},
                city:       {type:String},
                province:   {type:String},
                region:     {type:String},
                postcode:   {type:String},
                phone:      {type:String}
                }    
            },
    COD:{
        apply: {type:Boolean},
        currency:{type: String},
        total:{type:Number}
    }   ,    
    
    processing:{
        isOpen:{type:Boolean}, //user opens the order >>should be blocked for others
        assignedUser: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User",
                    }
                },
    changeLog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ChangeLog"
    }], 
},{timestamps: true})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order