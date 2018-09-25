const db = require('./models')
const faker = require('faker')
var clientsArr = []

for (let i=0;i<=250;i++)
    {
const data = {
    name: faker.name.findName(),
    address: {
        phone: faker.phone.phoneNumber(),
        street: faker.address.streetAddress(),
        country: faker.address.country(),
        city: faker.address.city(),
        province: faker.address.state(),
        region: faker.address.cityPrefix(),
        postcode: faker.address.zipCode(),
    }
}
clientsArr.push(data)
}


// console.log(clientsArr)
db.Client.create(clientsArr)

