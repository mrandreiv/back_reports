const db = require('./models')
const faker = require('faker')
var orders = []

for (let i=0;i<=13;i++)
    {
const data = {
    status:'Rejected',
    orderNr:faker.random.number(),
    client:{
        name: faker.name.findName()
    },
    affil: faker.company.companySuffix(),
    items:[{
        sku:faker.random.number(),
        name:"HeartTonic",
        description:'item description',
        quantity:Math.floor(Math.random()*5),
        price:Math.floor(Math.random()*800000),

    }],
    amount:{amuontIn:790},
    shipping: {
        shippingCost:140,
        // shipFrom:{
        //     company:faker.company.companyName()
        // },
        shipTo: {
            phone: faker.phone.phoneNumber(),
            street: faker.address.streetAddress(),
            country: 'Vietnam',
            city: faker.address.city(),
            province: faker.address.state(),
            region: faker.address.cityPrefix(),
            postcode: faker.address.zipCode(),
        }
    },

    COD:{
        currency:"CZK",
        total:930
             },
    processing: {
        isOpen: false,
        // assignedUser:{
        //     name:'Andrei'
        // }
}
}
orders.push(data)
}


// console.log(clientsArr)
db.Order.create(orders)

