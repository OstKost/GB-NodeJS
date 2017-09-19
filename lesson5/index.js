const express = require('express'),
    app = express(),
    handlebars = require('handlebars'),
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

handlebars.registerHelper('ifCond', (v1, v2, options) => {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
})

function errorHandler(err, req, res) {
    console.error(err.message)
    console.error(err.stack)
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

app.get('/complete/:id', (req, res) => {
    tasks.complete(req.params.id, (err, data) => {
        res.render('index', {
            err: err,
            list: data
        })
    })
})

app.get('/change/:id', (req, res) => {
    tasks.change(req.params.id, req.query, (err, data) => {
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