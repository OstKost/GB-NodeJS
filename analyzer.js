let args = require('minimist')(process.argv.slice(2));
let fs = require('fs');

let file = args.file;

if (!file) {
    console.log('Введите файл. Пример: "node .\analyzer.js --file log.txt"');
    return;
}

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Данные об играх нет');
        return;
    }
    let stats = data.split('\n');
    let games = stats.length - 1;

    let wins = 0, losses = 0, maxWins = 0, maxLosses = 0, countWins = 0, countLosses = 0;

    for (let key in stats) {
        
        if (stats[key] === 'Win') {
            wins++;
            countWins++;
        } else {
            if (countWins >= maxWins) {
                maxWins = countWins;
                countWins = 0;
            }
            countWins = 0;
        }

        if (stats[key] === 'Loss') {
            losses++;
            countLosses++;
        } else {
            if (countLosses >= maxLosses) {
                maxLosses = countLosses;
                countLosses = 0;
            }
            countLosses = 0;
        }
    }

    console.log(`Общее количество игр ${games}`);
    console.log(`Выигрышей ${wins}`);
    console.log(`Проигрышей ${losses}`);
    console.log(`Соотношение ${(wins/losses).toFixed(2)}`);
    console.log(`Максимальне число побед подряд ${maxWins}`);
    console.log(`Максимальне число проигрышей подряд ${maxLosses}`);
});