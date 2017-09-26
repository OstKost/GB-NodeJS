const express = require('express'),
    app = express(),
    handlebars = require('handlebars'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio'),
    tasks = require('./tasks'),
    users = require('./users'),
    passport = require('passport'),
    md5 = require('md5'),
    session = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    LocalStrategy = require('passport-local').Strategy

app.engine('html', engines.handlebars)
app.use(express.static(__dirname))
app.set('view engine', 'html')
app.set('views', `${__dirname}/views`)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: 'session',
    keys: ['key1', 'key2']
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy((username, password, done) => {
    const promise = users.findOne(username, md5(password))
    promise.then(
        result => {
            done(null, result)
        },
        error => {
            done(null, error)
        }
    )
}))

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    done(null, {username: username})
})

handlebars.registerHelper('ifCond', (v1, v2, options) => {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
})

const loginHandler = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
})

const needAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

function errorHandler(err, req, res) {
    console.error(err.message)
    console.error(err.stack)
}

app.all('/add', needAuthentication)
app.all('/delete', needAuthentication)
app.all('/complete', needAuthentication)
app.all('/change', needAuthentication)

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
    tasks.complete(req.params.id, req.query, (err, data) => {
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

app.get('/delete/:id', (req, res) => {
    tasks.delete(req.params.id, (err, data) => {
        res.render('index', {
            err: err,
            list: data
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        err: null,
        list: null
    })
})

app.post('/login', loginHandler)

app.get('/logout', (req, res) => {
    res.logout()
    res.redirect('/login')
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})
