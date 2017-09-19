const express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio'),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    tasks = require('./tasks')

app.engine('html', engines.handlebars)
app.set('view engine', 'html')
app.set('views', `${__dirname}/views`)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

function errorHandler(err, req, res) {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).render('index', {
        error: err
    })
}

app.get('/', (req, res) => {
    tasks.list((err, data) => {
        res.render('index', {
            err: err,
            list: data
        })    
    })    
})

app.post('/add', (req, res) => {
    tasks.add(req.body, (err, data) => {
        res.render('index', {
            err: err,
            list: data
        })    
    })  
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})
