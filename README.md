# File System Module

## Objectives

1. Describe file reading method of `fs`
1. Describe about buffer
1. Describe how to convert buffer to a string

## Overview

Have you ever needed to create a file or read from a file when you were building an application? Files can be used to store data permanently. Consider an app which takes user input from a web form (e.g., loan application), but is unable to save it. All the data will be lost if the app crashes and frustrated users won't be able to save their progress to finish the form at a later date. Of course databases are better at storing such data, but files can be used to. 

Another situation where files are using is if our app accepts user uploads such as images or audio files. Most likely, we'll want to read their content, transform, and store the images (just like Instagram). But it's all out of reach of the browser JavaScript. Only server side technologies can perform file manipulation on the system.

This lesson will cover the Node file system module which enables developers to write and read to/from files.

## fs.readFile()

First, we need to import the `fs` module and because it's a core module, we don't need to install it with npm (more on npm later).

```js
var fs = require('fs');
```

To read a file from your file system, simply call the `readFile()` by passing two arguments: path and name of the file, and a callback function. The callback function will have the file content which is the argument of the callback (`data`):

```js
var fs = require('fs')
var file = './fakepath/fakefilename.data'
fs.readFile(file, function(error, data){
  if (error) return console.error('Error', error)
  console.log(data)
})
```

We need to check the `error` argument of the callback to make sure the `readFile` worked successfully. As you can see, `readFile` works asynchronously. It's result is not available immediately after the function call. So this will print `undefined`:

```js
var fs = require('fs')
var file = './fakepath/fakefilename.data'
var data = fs.readFile(file, function(error, data){
  if (error) return console.error('Error', error)
})
console.log(data)
```

However, if you want to read the file synchronously (typically not recommended), then there's `readFileSync()` method. You can use it like this:

```js
var fs = require('fs')
var file = './fakepath/fakefilename.data'
try {
  var data = fs.readFileSync(file)
  console.log(data)
} catch (error) {
  console.error('Error', error)
}
```

The `try/catch` is needed to handle errors if the file reading failed. Use `try/catch` only with synchronous code, because with asynchronous code it will be useless due to the loss of content.

As far as the `file` variable goes, it's a great idea to make the path work on POSIX and Windows machines with `path.join()` and `__dirname` (covered earlier):

```
var file = path.join(__dirname, 'customers.csv')
```

Write your own asynchronous script to read from `customers.csv`, or just run `read.js` with `node read`. If the result is something like this:

```
<Buffer 69 64 2c 66 69 72 73 74 5f 6e 61 6d 65 2c 6c 61 73 74 5f 6e 61 6d 65 2c 65 6d 61 69 6c 2c 67 65 6e 64 65 72 2c 69 70 5f 61 64 64 72 65 73 73 0a 31 2c ... >
```

That's right, because `data` is Buffer and not a string.

## Buffer

Buffer is a special Node-exclusive data type (it does not exists in browser JavaScript). We use buffers for raw binary data. Think about buffer as a binary data type. Buffers are instances of the Buffer class which a global object (`global.Buffer`), that's why we don't need to import it with `require()`. 

A typical buffer corresponds to some raw binary data. In this example, buffer looks like a list of numbers and characters. So buffers act somewhat like arrays of integers, but aren't resizable and have methods specifically for binary data. That's because the sizes of buffers are fixed upon their creations. 

If you're familiar with `TypedArray` in ECMAScript 2015 (ES6), then Buffer is very similar to it. For more information on buffers and their methods, check out the resources for links.

We can easily convert buffer to string and back by specifying the encoding. For example, we can convert our CSV data into a human readable string with `toString('utf-8')`:

```js
  console.log(data.toString('utf-8'))
```

Another way is to pass an option object to the `readFile()` as a second argument. In that object, create `encoding` property with the value of the desired encoding (e.g., `utf-8`).

```js
var fs = require('fs')
var path = require('path')
var file = path.join(__dirname, 'customers.csv')
fs.readFile(file, {encoding: 'utf-8'}, function(error, data){
  if (error) return console.error('Error', error)
  console.log(data)
})
```

So we know how to read from a file now, but what about writing or creating a file? It's very straightforward and we also use buffers unless an encoding is provided.

## fs.writeFile()

To write data to a file, use `writeFile()` with arguments: file, data and callback. For example, we need to convert the aforementioned CSV file into the file `customers.json`. We can read the CSV file, iterate over every line, create a customer object for each line with ID, first and last names, email, sex, and IP address:

```js
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
})
```

To write the `json` object to a file, simply pass it to the `writeFile()` (the `write.js` file):

```js
...
  var jsonFile = path.join(__dirname, 'customers.json')
  fs.writeFile(jsonFile, JSON.stringify(json, null, 2), function(error){
    if (error) return console.error('Error', error)
    console.log('customer.json is written')
  })
```


The use of  `JSON.stringify()` is important because we want to save the text representation of the JSON object. Without it, we would get `[Object]` in the file. The parameters `null` and `2` are not that important. They are simply to make JSON in the file look more human-readable by adding formatting.

Speaking of buffers, we can pass a buffer at the content (second argument) to the `writeFile()` function.

It's worth mentioning that `writeFile()` has a synchronous counterpart `writeFileSync()` analogous how `readFile` has `readFileSync`.

## Resources

1. [fs Official Documentation](https://nodejs.org/api/fs.html)
1. [Buffer Official Documentation](https://nodejs.org/api/buffer.html)
1. [writeFile Official Documentation](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
1. [Node.js Buffers Video from EggHead](https://egghead.io/lessons/node-js-node-js-buffers)
1. [Node.js Buffers Video from Mastering NodeJS](https://www.youtube.com/watch?v=FVKO8wZNcnI)

---

<a href='https://learn.co/lessons/node-fs' data-visibility='hidden'>View this lesson on Learn.co</a>
