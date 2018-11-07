const express = require ('express')
const router =express.Router({mergeParams:true})
const helpers = require('../helpers/orders.js')

router.route('/status/:status')
       .get(helpers.getOrders)

       //find order by client name
       //find order by phone nr
router.route('/phone/:phonenr')
        .get(helpers.getOrdersPhone)
router.route('/name/:name')
        .get(helpers.getOrdersName)
       
router.route('/:id')
        .post(helpers.createOrder)
        .get(helpers.getOrderId)
        .put(helpers.updateOrder)
        

router.route('/:id/items/:itemId')
        .post(helpers.deleteItem)
        

router.route('/:id/items/')
        .post(helpers.addItem)

router.route('/search/:id')
        .get(helpers.getOrderIdSearch)
        
router.route('/ref/:affil')
        .post(helpers.createOrder)

        
module.exports = router;