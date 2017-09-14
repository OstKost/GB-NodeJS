/* Создать программу для получения информации о последних
новостях с выбранного вами сайта в структурированном виде.*/
const request = require('request')
const cheerio = require('cheerio')

request('https://www.gamespot.com/news/', (error, response, html) => {
    if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html)
        $('.filter-results article').each((i, elem) => {
            console.log(`Acticle №${i+1}\n${$(elem).find('img').attr('src')}\n${$(elem).find('h3').text()}\n${$(elem).find('p').text()}\n`)
        })
    }
})
