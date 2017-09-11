const fs = require('fs');
const {file} = require('minimist')(process.argv.slice(2));

if (!file) {
    console.log('Введите файл. Пример: "node .\analyzer.js --file log.txt"');
    return;
}

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Данных об играх нет');
        return;
    }
    const stats = data.split('\n');
    let wins = 0, losses = 0, maxWins = 0, maxLosses = 0, countWins = 0, countLosses = 0;

    for (let key in stats) {        
        if (/^W/.test(stats[key])) {
            wins++;
            countWins++;
            if (countLosses >= maxLosses) {
                maxLosses = countLosses;
                countLosses = 0;
            }
            countLosses = 0;
        } else {
            losses++;
            countLosses++;
            if (countWins >= maxWins) {
                maxWins = countWins;
                countWins = 0;
            }
            countWins = 0;
        }
    }

    console.log(`Общее количество игр ${stats.length - 1}`);
    console.log(`Выигрышей ${wins}`);
    console.log(`Проигрышей ${losses}`);
    console.log(`Соотношение ${(wins/losses).toFixed(2)}`);
    console.log(`Максимальне число побед подряд ${maxWins}`);
    console.log(`Максимальне число проигрышей подряд ${maxLosses}`);
})