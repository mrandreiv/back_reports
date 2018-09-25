const db  = require('../models')

exports.getClients=async function(req,res,next){
try {
      let foundClients = await db.Client.find()
      return res.status(200).json(foundClients)
} catch (error) {
    return next(error)
            }}

exports.getClient = async function (req, res, next){}
exports.createClient=async function(req,res,next){}
exports.deleteClient=async function(req,res,next){}
exports.updateClient=async function(req,res,next){}
        

module.exports = exports;