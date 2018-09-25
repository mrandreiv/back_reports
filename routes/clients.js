var express = require('express');
var router = express.Router({mergeParams:true});
const helpers = require('../helpers/client.js')

router.route('/')
    .get(helpers.getClients)

router.route('/:id')
    .get(helpers.getClient)
    .put(helpers.updateClient)

module.exports = router;