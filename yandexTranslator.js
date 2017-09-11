/* Создать переводчик слов с английского на русский,
 который будет обрабатывать входящие GET запросы и возвращать ответы,
 полученные через API Яндекс.Переводчика. */
const request = require('request')
const urlutils = require('url')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const token = 'trnsl.1.1.20170911T125301Z.213a3b1e818789a4.1790e77f4e5cefe94ceba67a892920a06bcfbd02'
const yandexUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate`

console.log('Введите слово или фразу для перевода:')

rl.on('line', (cmd) => {
    let params = urlutils.parse(yandexUrl, true)
    delete params.search
    params.query = {
        key: token,
        text: cmd,
        lang: 'en',
        options: 1
    }
    request(urlutils.format(params), function (error, response, data) {
        if (!error && response.statusCode == 200) {
            let phrase = JSON.parse(data).text.join(', ')
            console.log(`На английском это будет:\n${phrase}`)
        }
    })
})
