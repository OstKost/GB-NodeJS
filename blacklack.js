const colors = require('colors');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const winScore = 21;

function writeLog(string) {
    fs.appendFile('log_bj.txt', string + '\n',  (err) => {
        if (err) throw err;
    })
}

function gameStart() {
    console.log(colors.bold.yellow.bgBlue('\n Начинаем игру в Блекджек.'));
    let playerScore = 0;
    riseScore(playerScore);
}

function riseScore(score) {
    score += cards[Math.floor(Math.random() * cards.length)];
    console.log(`Текущий счет ${score}`);
    checkScore(score);
}

function checkScore(score) {
    if (score > winScore) {
        console.log(colors.red(`Перебор. Вы проиграли.`));
        writeLog('Loss');
        gameStart();
    } else if (score === winScore) {
        console.log(colors.green(`ОЧКО!. Вы выиграли.`));
        writeLog('Win');
        gameStart();
    } else {
        rl.question('Еще? ( Yes (any key), No ): ',  (answer) => {
            if (/^n/i.test(answer)) {
                console.log(`Ваш счет ${score}, играет компьютер.`);
                riseScoreAI(0, score);
            } else {
                riseScore(score);
            }            
        });
    }
}

function riseScoreAI(score, playerScore) {
    score += cards[Math.floor(Math.random() * cards.length)];;
    console.log(`Текущий счет компьютера ${score}`);
    checkScoreAI(score, playerScore);
}

function checkScoreAI(score, playerScore) {
    if (score > winScore) {
        console.log(colors.green(`У компьютера Перебор. Вы победили.`));
        writeLog('Win');
        gameStart();
    } else if (score === winScore) {
        console.log(colors.red(`У компьютера ОЧКО!. Вы проиграли.`));
        writeLog('Loss');
        gameStart();
    } else if (score < playerScore) {
        riseScoreAI(score, playerScore);
    } else {
        console.log(`Ваш счет ${playerScore}, счет компьютера ${score}.`);
        if (playerScore <= score) {
            console.log(colors.red(`Вы проиграли.`));
            writeLog('Loss');
        } else {
            console.log(colors.green(`Вы победили.`));
            writeLog('Win');
        }
        gameStart();
    }
}

// Начнем игру !
gameStart();