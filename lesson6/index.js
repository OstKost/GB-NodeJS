const express = require('express'),
    app = express(),
    handlebars = require('handlebars'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    request = require('request'),
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
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: 'session',
    keys: ['key'],
    maxAge: 5 * 60 * 1000
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, (username, password, done) => {
    const promise = users.checkLogin(username, md5(password))
    promise.then(
        result => done(null, result),
        error => done(error)
    )
}))

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    const promise = users.findOne(username)
    promise.then(
        result => done(null, result),
        error => done(error)
    )
})

const errorHandler = (err, req, res) => {
    console.error(err.message)
    console.error(err.stack)
}

handlebars.registerHelper('ifCond', (v1, v2, options) => {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
})

const loginHandler = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}, (req, res) => {
    req.session.username = req.body.username
    req.session.password = req.body.password
    if (req.body.remember) {
        req.session.rememberme = req.body.rememberme
        req.session.cookie.maxAge = 10 * 60 * 1000
    } else {
        req.session.rememberme = false    
        req.session.cookie.expires = false
    }
})

const needAuthentication = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/login')
}

app.all('/add', needAuthentication)
app.all('/delete/*', needAuthentication)
app.all('/complete/*', needAuthentication)
app.all('/change/*', needAuthentication)

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
    req.logOut()
    res.redirect('/login')
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})
