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
    cheerio = require('cheerio')

app.engine('html', engines.handlebars)
app.set('view engine', 'html')
app.set('views', `${__dirname}/views`)
app.use(bodyParser.urlencoded({
    extended: true
}))

function errorHandler(err, req, res, next) {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).render('error_template', {
        error: err
    })
}

function newsParser(req, res, render) {
    const data = {
        url: req.body.url,
        articles: []
    }
    request(req.body.url, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html)
            $('.uscontinue .post').each((i, elem) => {
                if (i > req.body.size) return false
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
        render(res, data)
    })
}

app.get('/', (req, res) => {
    res.render('index', {
        url: ' - Выберите категорию из списка.'
    })
})

app.post('/form_handler', (req, res) => {
    newsParser(req, res, (response, data) => {
        // console.log(data)
        response.render('index', data)
    })
})

app.use(errorHandler)

app.listen(3000, function () {
    console.log('Express server listening on port %s.', this.address().port)
})