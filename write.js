var fs = require('fs')
var path = require('path')
var file = path.join(__dirname, 'customers.csv')
fs.readFile(file, {encoding: 'utf-8'}, function(error, data){
  if (error) return console.error('Error', error)
  console.log(data)
  var json = []
  data.split('\n').forEach(function(customerLine){
    var customer = {}
    customer.id = customerLine.split(',')[0]
    customer.firstName = customerLine.split(',')[1]
    customer.lastName = customerLine.split(',')[2]
    customer.email = customerLine.split(',')[3]
    customer.sex = customerLine.split(',')[4]
    customer.ip = customerLine.split(',')[5]
    json.push(customer)
  })
  console.log(json)
  var jsonFile = path.join(__dirname, 'customers.json')
  fs.writeFile(jsonFile, JSON.stringify(json), function(error){
    if (error) return console.error('Error', error)
    console.log('customer.json is written')
  })
})
