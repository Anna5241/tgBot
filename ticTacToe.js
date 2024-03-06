module.exports = {
    playTicTacToe,
};



function resetGame() {
    gameBoard = [
        [' . ', ' . ', ' . '],
        [' . ', ' . ', ' . '],
        [' . ', ' . ', ' . ']
    ];
    currentPlayer = 'X';
}

let gameBoard = [
    [' . ', ' . ', ' . '],
    [' . ', ' . ', ' . '],
    [' . ', ' . ', ' . ']
];

let currentPlayer = 'X';

function isValidMove(row, col) {
    return gameBoard[row][col] === ' . ';
}

function getGameBoardAsString() {
    let str = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            str += gameBoard[i][j] + ' ';
        }
        str += '\n';
    }
    return str;
}

function checkDraw() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameBoard[i][j] === ' . ') {
                return false;
            }
        }
    }
    return true;
}

function getGameBoardAsString() {
    let str = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            str += gameBoard[i][j] + ' ';
        }
        str += '\n';
    }
    return str;
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (gameBoard[i][0] === currentPlayer && gameBoard[i][1] === currentPlayer && gameBoard[i][2] === currentPlayer) {
            return true;
        }
        if (gameBoard[0][i] === currentPlayer && gameBoard[1][i] === currentPlayer && gameBoard[2][i] === currentPlayer) {
            return true;
        }
    }
    if (gameBoard[0][0] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][2] === currentPlayer) {
        return true;
    }
    if (gameBoard[0][2] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][0] === currentPlayer) {
        return true;
    }
    return false;
}

function playTicTacToe(chatId, bot){
    resetGame();
    bot.sendMessage(chatId, 'Давай поиграем в крестики-нолики:\n' + getGameBoardAsString());
    bot.on('message', async msg =>{
    if (msg.text.includes('1') || msg.text.includes('2') || msg.text.includes('3')) {
        const row = parseInt(msg.text.substring(0, 1)) - 1; 
        const col = parseInt(msg.text.substring(1, 2)) - 1;
        if (isValidMove(row, col)) {
            gameBoard[row][col] = currentPlayer;
            bot.sendMessage(chatId, getGameBoardAsString());
            if (checkWin()) {
                bot.sendMessage(chatId, `Игрок ${currentPlayer} победил!`);
                resetGame();
            } else if (checkDraw()) {
                bot.sendMessage(chatId, 'Ничья!');
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                bot.sendMessage(chatId, `Очередь ${currentPlayer}`);
            }
        } else {
            bot.sendMessage(chatId, 'Неправильный ход, попробуй снова');
        }
    }
    })
    
}