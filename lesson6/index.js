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
    // passReqToCallback: true,
}, (username, password, done) => {
    const promise = users.checkLogin({
        username,
        password: md5(password).toLowerCase()
    })
    promise.then(
        result => done(null, result),
        error => done(error)
    )
}))

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    const promise = users.findOne({
        username
    })
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

const needAuthentication = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/login')
}

app.all('/add', needAuthentication)
app.all('/delete/*', needAuthentication)
app.all('/complete/*', needAuthentication)
app.all('/change/*', needAuthentication)

// Хочу проверить куки и сессии
// app.all('/*', (req, res, next) => {
//     console.dir("req.headers[cookie]: " + req.headers['cookie'])
//     console.dir("req.cookies: " + JSON.stringify(req.cookies))
//     console.dir("req.session: " + JSON.stringify(req.session))
//     console.dir("###")
//     next();
// })

app.get('/', (req, res) => {
    tasks.list((err, data) => {        
        res.render('index', {
            err: err,
            list: data,
            user: req.session.passport && req.session.passport.user ? req.session.passport.user : 'Sorry, you are not logged in.'
        })
    })
})

app.post('/add', (req, res) => {
    tasks.add(req.body, (err, data) => {
        res.render('index', {
            err: err,
            list: data,
            user: req.session.passport && req.session.passport.user ? req.session.passport.user : 'Sorry, you are not logged in.'
        })
    })
})

app.get('/complete/:id', (req, res) => {
    tasks.complete(req.params.id, req.query, (err, data) => {
        res.render('index', {
            err: err,
            list: data,
            user: req.session.passport && req.session.passport.user ? req.session.passport.user : 'Sorry, you are not logged in.'
        })
    })
})

app.get('/change/:id', (req, res) => {
    tasks.change(req.params.id, req.query, (err, data) => {
        res.render('index', {
            err: err,
            list: data,
            user: req.session.passport && req.session.passport.user ? req.session.passport.user : 'Sorry, you are not logged in.'
        })
    })
})

app.get('/delete/:id', (req, res) => {
    tasks.delete(req.params.id, (err, data) => {
        res.render('index', {
            err: err,
            list: data,
            user: req.session.passport && req.session.passport.user ? req.session.passport.user : 'Sorry, you are not logged in.'
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        username: req.cookies.username || '',
        password: req.cookies.password || '',
        remember: req.cookies.remember || null,
    })
})

// res.setHeader("Set-Cookie", [`username=${req.body.username}`, `password=${req.body.password}`, `rememberme=${req.body.rememberme}`])
const setCookies = (req, res, next) => {
    if (req.body.remember === 'on') {
        res.cookie('username', req.body.username, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        res.cookie('password', req.body.password, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        res.cookie('remember', req.body.remember, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        })
    } else {
        res.clearCookie('username')
        res.clearCookie('password')
        res.clearCookie('remember')
    }
    next()
}

app.post('/login', setCookies)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})