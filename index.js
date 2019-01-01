require('dotenv').config()

const express = require('express')
const bodyParser=require('body-parser')
const cors = require('cors')
const errorHandler = require('./helpers/error')
const getOrderRoutes = require('./routes/orders')
const getClientRoutes = require('./routes/clients')
const socketIO = require('socket.io')
const http = require('http')

const app = express();


// our server instance
const server = http.createServer(app)
const io = socketIO(server)
port = 8081
///atach the instance to the req object
app.use(function (req, res, next) {
    req.io = io;
    next();
})

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

io.on('connection', (client) => {
    console.log('New client connected')
  
    // client.on('orderBusy', data => {
    //     console.log('message from CLIENT. busy order',data)
    //     io.emit('orderBusy',data)
    // })
    client.on('orderClosed', data => {
        console.log('message from CLIENT. ORDER CLOSED:', data)
        io.emit('orderClosed', data)
    })
    client.on('orderUpated', data => {
        console.log('message from CLIENT. ORDER StatusUpdate:', data)
        io.emit('orderUpated', data)
    })
})


server.listen(port, () => console.log(`Listening on port ${port}`))
// app.listen(PORT,function(){console.log(`Server started at port ${PORT}`)})