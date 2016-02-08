var fs = require('fs')
var path = require('path')
var file = path.join(__dirname, 'customers.csv')
var data = fs.readFile(file, function(error, data){
  if (error) return console.error('Error', error)
  console.log(data)
})
