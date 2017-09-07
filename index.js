var colors = require('colors')
var beeper = require('beeper')

beeper()
console.log(colors.underline.green('Hello, i\'m a NodeJS app.'))

var sec = 0;
var intID = setInterval(function() {
    console.log(++sec)    
}, 1000)

setTimeout(function() {
    console.log(colors.italic.grey('Loading some stuff..'))    
}, 5000)

setTimeout(function() {
    console.log(colors.rainbow('beep beep'))
    beeper('**')
}, 10000)

setTimeout(function() {
    console.log(colors.bold.bgRed('That\'s it.'))
    clearInterval(intID)
}, 15000)