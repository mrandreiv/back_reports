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
exports.getOrderId = async function (req, res, next){
    try {
        let id = req.params.id
        let result = await db.Order.find({orderNr:new RegExp(id,'i')})
        return res.status(200).json(result)
        
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
exports.updateOrder = async function (req, res, next) {}

module.exports = exports;