require('dotenv').config()

const express = require('express')
const bodyParser=require('body-parser')
const cors = require('cors')
const errorHandler = require('./helpers/error')
const getOrderRoutes = require('./routes/orders')
const getClientRoutes = require('./routes/clients')

const app = express();

PORT = 8081

app.use(bodyParser.json())
app.use(cors())

//ROUTES
app.use('/orders',getOrderRoutes)
app.use('/clients',getClientRoutes)

//END - ROUTES


app.use(function(req,res,next){
    let err= new Error ("Page Not Found")
    err.status = 404
    next(err)
})

app.use(errorHandler)

app.listen(PORT,function(){console.log(`Server started at port ${PORT}`)})