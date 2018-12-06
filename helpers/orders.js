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
       let foundOrder= await db.Order.findOne({orderNr: id})
                                     .populate('changeLog')
                                     .populate("comments")
                                      

        console.log("====ORDER FOUND: ...=====",foundOrder._id)                               
        return res.status(200).json(foundOrder)
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
        let orderNr = req.params.id
        // console.log(orderId,req.body)
         await db.Order.findOneAndUpdate({orderNr:orderNr},req.body, {new: true})
                                    
        let foundOrder = await db.Order.findOne({orderNr: orderNr})
                                                     .populate('changeLog')

        console.log('+++++++UPDATED++++++:', foundOrder)
        return res.status(200).json(foundOrder)

    } catch (error) {
        return next(error)
    } 
}


exports.deleteItem = async function(req,res,next)
{
try {
    let orderId=req.params.id
    let itemId = req.params.itemId
    
    let foundOrder = await db.Order.findOne({
                            $and:[
                                {orderNr:orderId},
                                {"items._id":itemId}
                            ]})

    let delItem = foundOrder.items.filter(item => item._id == itemId)
                            
    await db.Order.updateOne({orderNr:orderId},
        {$pull:{items:{_id:itemId}}}) // deleteITeim useing $unset to remove a key from collection
        
    //log the change to collection ChangeLog
        let  what ={
            oldValue:{
                name:'',
                price:'',
                quantity:''
            }
        }
        what.oldValue.name = delItem[0].name
        what.oldValue.price=delItem[0].price
        what.oldValue.quantity=delItem[0].quantity

        console.log('+++DELETEING ITEM: ', what)

        let newLog = await db.ChangeLog.create({
            orderId: orderId,
            who: "user",
            when: Date.now(),
            what: what
        })
            foundOrder.changeLog.push(newLog._id)
            await foundOrder.save()

            let updateOrder=await db.Order.findOne({orderNr:orderId}).populate('changeLog')       
    return res.status(200).json(updateOrder)
    
} catch (error) {
    return next(error)
}
}

exports.addItem = async function(req,res,next){
    
    try {
        let orderId=req.params.id
         await db.Order.update({orderNr:orderId},{$push:{items:req.body}})

        let foundOrder = await db.Order.findOne({orderNr: orderId})
        
        //add the log to collection
        let  what ={
            newValue:{
                name:'',
                price:'',
                quantity:''
            }
        }

        what.newValue.name=req.body.name
        what.newValue.price=req.body.price
        what.newValue.quantity=req.body.quantity
        console.log("----ADDING ITEM:", what)
        
        let newLog = await db.ChangeLog.create({
            orderId: orderId,
            who: "user",
            when: Date.now(),
            what: what
        })
       
             foundOrder.changeLog.push(newLog._id)
            await foundOrder.save()

        const updateOrder = await db.Order.findOne({orderNr:orderId})
                                            .populate('changeLog')
        console.log('====UPDATED ORDER (added new item)====: ',updateOrder)
        return res.status(200).json(updateOrder)
               
        // return res.send('hello')
    } catch (error) {
        return next(err)
        
    }
}

exports.addLog = async function (req, res, next) {

    try {
       let{who,what,orderId} = req.body

        foundOrder = await db.Order.findOne({orderNr: orderId})
        let newLog = await db.ChangeLog.create(
                {
                    orderId:orderId,
                    who:who,
                    when: Date.now(),
                    what:what
        })
        console.log('___NEWLOG____:',newLog)
        
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

exports.addComment = async function(req,res,next){
    try {
        let {user,text} = req.body
        let orderNr  = req.params.id
        const foundOrder = await db.Order.findOne({orderNr:orderNr})
         console.log("ORDER COMMENT:..",foundOrder.orderNr)

        const newCommment  = await db.Comment.create({
            orderNr: orderNr,
            user:user,
            text:text,
            date:Date.now()
        })
        console.log('New comment added:',newCommment) 

        foundOrder.comments.push(newCommment._id)
        await foundOrder.save()

        const allComments = await db.Order.findOne({
            orderNr: orderNr
        })
        .populate("comments")
        .sort({date:-1})

        return res.status(200).json(allComments)
        
    } catch (error) {
        return next(error)
    }
}
exports.editComment = async function (req,res,next){
    try {
        
    } catch (error) {
        return next (error)
    }
}

exports.deleteComment = async function (req,res,next){
    try {
        
    } catch (error) {
        return next(error)
    }
}

exports.getComments = async function(req,res,next){
    try {
            const orderNr  = req.params.id
            const foundOrder = await db.Order.findOne({orderNr:orderNr}).populate("comments")
            

            const comments = foundOrder.comments
            console.log('order show comments for..', comments)

            return res.status(200).json(comments)
        
    } catch (error) {
        return next(error)
    }
}

exports.getComment = async function(req,res,next){
    try {
        
    } catch (error) {
        return next(error)
    }
}
module.exports = exports;

