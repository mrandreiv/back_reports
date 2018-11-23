const db =require('../models')
const faker = require('faker')

//GET

exports.getOrdersPhone = async function(req,res,next){
    try {
        let phoneNr = req.params.phonenr
        let result = await db.Order.find({
            'shipping.shipTo.phone': new RegExp(phoneNr, 'i')
        })
        return res.status(200).json(result)

    } catch (error) {
        return next(error)
    }
}
exports.getOrdersName = async function (req, res, next) {
    try {
        let name = req.params.name
        let result = await db.Order.find({
            'client.name': new RegExp(name, 'i')
        })
        return res.status(200).json(result)

    } catch (error) {
        return next(error)
    }
}
exports.getOrderIdSearch = async function (req, res, next){
    try {
        let id = req.params.id
        let result = await db.Order.find({orderNr:new RegExp(id, 'i')})
                                  
        return res.status(200).json(result)
        
    } catch (error) {
        return next(error)
    }
}
exports.getOrderId = async function (req, res, next) {
    try {
        let id = req.params.id
        await db.Order.findOne({orderNr: id})
                                    .populate('changeLog')
                                    .sort({when:-1})
                                    .exec(function(err,doc){
                                                return res.status(200).json(doc)
                                    })



    } catch (error) {
        return next(error)
    }
}

exports.getOrders = async function (req, res, next) {

    try {
        let status = req.params.status  
        req.params.status!=='all' ? orders = await db.Order.find({status:new RegExp(status,'i')})
                                  : orders = await db.Order.find()


        return res.status(200).json(orders)

    } catch (error) {
        return next(error)
    }
}
//POST
exports.createOrder = async function(req,res,next){

try {
    let order  = await db.Order.create(
        {
            status: 'New',
            orderNr: faker.random.number(),
            // client:{
            //     name: `${faker.name.firstName()} ${faker.name.lastName()}`
            // },
            affil: req.params.affil,
            items: [{
                sku: faker.random.number(),
                name: faker.commerce.productName(),
                description: 'item description',
                quantity: Math.floor(Math.random() * 5),
                price: Math.floor(Math.random() * 800000),
            }],
            amount: {
                amuontIn: 790
            },
            shipping: {
                shippingCost: 140,
                // shipFrom:{
                //     company:faker.company.companyName()
                // },
                shipTo: {
                    phone: faker.phone.phoneNumber(),
                    street: faker.address.streetAddress(),
                    country: 'Czech republic',
                    city: faker.address.city(),
                    province: faker.address.state(),
                    region: faker.address.cityPrefix(),
                    postcode: faker.address.zipCode(),
                }
            },

            COD: {
                currency: "CZK",
                total: 930
            },
            processing: {
                isOpen: false,
                // assignedUser:{
                //     name:'Andrei'
                // }
            }
        }
    )


    let createdOrder = db.Order.findById(order._id)
    return res.status(200).json(createdOrder)


} catch (error) {
    return next(error)}
}


exports.updateOrder = async function (req, res, next) {
    try {
        let orderId=req.params.id
        console.log(orderId,req.body)
        let order = await db.Order.findOneAndUpdate({orderNr:orderId},req.body, {new: true})
                                    .populate('changeLog')
        
         console.log('+++++++UPDATED++++++:',order)
        return res.status(200).json(order)

    } catch (error) {
        return next(error)
    } 
}


exports.deleteItem = async function(req,res,next)
{
try {
    let orderId=req.params.id
    console.log(orderId)
  await db.Order.update({orderNr:orderId},
        {$pull:{items:{_id:req.params.itemId}}}) // deleteITeim useing $unset to remove a key from collection

    let order = await db.Order.findOne({
        orderNr: orderId
    })
    console.log(order)

    return res.status(200).json(order)
    
} catch (error) {
    return next(error)
}
}

exports.addItem = async function(req,res,next){
    
    try {
        let orderId=req.params.id
            console.log("----ADDING ITEM:",orderId, req.body)

         await db.Order.update({orderNr:orderId},{$push:{items:req.body}})

        let order = await db.Order.findOne({orderNr:orderId})

        return res.status(200).json(order)
               
        // return res.send('hello')
    } catch (error) {
        return next(err)
        
    }
}

exports.addLog = async function (req, res, next) {
    console.log('request body:', req.body)
    try {
       let{who,what,orderId} = req.body

        let newLog = await db.ChangeLog.create(
                {
                    orderId:orderId,
                    who:who,
                    when: Date.now(),
                    what:what
        })
        console.log('___NEWLOG____:',JSON.stringify(newLog))

        let foundOrder=await db.Order.findOne({orderNr:orderId})
        foundOrder.changeLog.push(newLog._id)
        await foundOrder.save()

        return res.status(200).json(foundOrder)

    } catch (error) {
          return next(error)
          }

}
exports.getLogs = async function(req,res,next){
    
    try {
        let logs = await db.ChangeLog.find()
        return res.status(200).json(logs)
    

    } catch (error) {
        return next(error)
    }
}
module.exports = exports;