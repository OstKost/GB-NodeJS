let readline = require('readline');
let fs = require('fs');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function writeLog(string) {
    fs.appendFile('log_bj.txt', string + '\n', function (err) {
        if (err) {
            throw err;
        }
    });
}

function gameStart() {
    console.log('');
    console.log('Начинаем игру в Блекджек.');
    let playerScore = 0;
    riseScore(playerScore);
    checkScore(playerScore);
}

function riseScore(score) {
    let card = cards[Math.floor(Math.random() * cards.length)];
    score += card;
    console.log(`Текущий счет ${score}`)
    checkScore(score);
}

function checkScore(score) {
    if (score > 21) {
        console.log(`Перебор. Вы проиграли.`);
        writeLog('Loss');
        gameStart();
    } else if (score == 21) {
        console.log(`ОЧКО!. Вы выиграли.`);
        writeLog('Win');
        gameStart();
    } else {
        rl.question('Еще? ( Yes (or enter), No ): ', function (answer) {
            if (answer === '' || answer.toLowerCase()[0] === 'y') {
                riseScore(score);
            } else if (answer.toLowerCase()[0] === 'n') {
                console.log(`Ваш счет ${score}, играет компьютер.`);
                gameStartAI(0, score);
            }
        });
    }
}

function gameStartAI(enemyScore, playerScore) {
    riseScoreAI(enemyScore, playerScore);
}

function riseScoreAI(score, playerScore) {
    let card = cards[Math.floor(Math.random() * cards.length)];
    score += card;
    console.log(`Текущий счет компьютера ${score}`)
    checkScoreAI(score, playerScore);
}

function checkScoreAI(score, playerScore) {
    if (score > 21) {
        console.log(`У компьютера Перебор. Вы победили.`);
        writeLog('Win');
        gameStart();
    } else if (score == 21) {
        console.log(`У компьютера ОЧКО!. Вы проиграли.`);
        writeLog('Loss');
        gameStart();
    } else if (score < playerScore) {
        riseScoreAI(score, playerScore);
    } else {
        console.log(`Ваш счет ${playerScore}, счет компьютера ${score}.`);
        if (playerScore <= score) {
            console.log(`Вы проиграли.`);
            writeLog('Loss');
        } else {
            console.log(`Вы победили.`);
            writeLog('Win');
        }
        gameStart();
    }
}

gameStart();