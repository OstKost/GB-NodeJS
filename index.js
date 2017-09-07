let readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function gameStart() {
    console.log('Орёл или решка? (1 - орел, 2 - решка, 0 - выход)');
}

gameStart();

rl.on('line', function (cmd) {
    let result = Math.random() > 0.5 ? '2' : '1';
    if (cmd < 1 || cmd > 2) {
        console.log('Че то не то. Попробуйте еще раз');
        gameStart();
    } else if (cmd === '0') {
        console.log('Спасибо за игру');
        this.close();
    } else {
        if (cmd === result) {
            console.log('Вы выиграли');
        } else {
            console.log('Вы проиграли');
        }
        gameStart();
    }
})