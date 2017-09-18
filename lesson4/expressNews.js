/*Создать на основе express и handlebars веб-сервис с HTML-
интерфейсом для динамической загрузки информации с одного из
нескольких сайтов в выбранном формате. Зайдя на этот сервис,
пользователь сможет с помощью формы настроить параметры
информационной подборки (например, количество отображаемых
новостей или их категорию) и получить ее в удобном виде. Форма
должна отправляться на сервер методом POST.*/
const express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio'),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser')

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
    res.status(500).render('error_template', {
        error: err
    })
}

function chooseUrl(category) {
    switch (category) {
        case 'games':
            return "http://www.novostiit.net/category/igry"
        case 'internet':
            return "http://www.novostiit.net/category/internet"
        case 'tech':
            return "http://www.novostiit.net/category/tehno"
        case 'science':
            return "http://www.novostiit.net/category/nauka"
        default:
            return "http://www.novostiit.net/category/novosti"
    }
}

function newsParser(data, callback) {
    request(data.url, (err, res, html) => {
        if (!err && res.statusCode === 200) {
            const $ = cheerio.load(html)
            $('.uscontinue .post').each((i, elem) => {
                if (i > data.size) return false
                const article = {
                    pic: $(elem).find('.wp-post-image').attr('src'),
                    url: $(elem).find('.ptitle a').attr('href'),
                    title: $(elem).find('.ptitle a').attr('title'),
                    preview: $(elem).find('p').text()
                }
                if (article.pic || article.url || article.title || article.preview) {
                    data.articles.push(article)
                }
            })
        }
        callback(err, data)
    })
}

app.get('/', (req, res) => {
    res.render('index', {
        url: '#',
        size: req.session.size || 5
    })
})

app.post('/form_handler', (req, res) => {
    // console.log('Cookies session: ', req.session)
    // console.log('Cookies: ', req.cokies)
    req.session.category = req.body.category
    req.session.size = req.body.size
    const data = {
        category: req.session.category,
        size: req.session.size,
        url: chooseUrl(req.session.category),
        articles: []
    }
    newsParser(data, error => {
        if (!error)
            res.render('index', data)
    })
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})