const TelelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./Option')

const tocken = "6945321356:AAG91Nc-JZfQB-KKvl0pSSMecSV-wjGgtvg"

const bot = new TelelegramApi(tocken, {polling: true})

const chats = {}

let allMessages = [];

let gameBoard = [
    [' . ', ' . ', ' . '],
    [' . ', ' . ', ' . '],
    [' . ', ' . ', ' . ']
];

let currentPlayer = 'X';

function resetGame() {
    gameBoard = [
        [' . ', ' . ', ' . '],
        [' . ', ' . ', ' . '],
        [' . ', ' . ', ' . ']
    ];
    currentPlayer = 'X';
}


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
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
});

function isValidMove(row, col) {
    return gameBoard[row][col] === ' . ';
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
function getAllMessagesFromChat() {
    // Логика получения сообщений из чата
    // Пример для Telegram Bot API:
    bot.getUpdates().then((updates) => {
        updates.forEach((update) => {
            if (update.message) {
                addMessageToChat(update.message);
            }
        });
    }).catch((error) => {
        console.error('Ошибка получения сообщений из чата: ', error);
    });
}
function addMessagesToAll(msg) {
    allMessages.push(msg); // добавляем новое сообщение в массив
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


const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен будешь его отгадать');
    
    const randomNumber = Math.floor(Math.random()* 10);
    chats[chatId] = randomNumber;
    setTimeout(() => { bot.sendMessage(chatId,'Отгадывай', gameOptions); }, 1000);
}

const start = () =>{
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие'},
        { command: '/info', description: 'Информация о вас'},
        { command: '/game', description: 'Игра -_-'},
        { command: '/reset', description: 'Очистить переписку'},
        { command: '/gamestart', description: 'Крестики нолики'}
    ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        addMessagesToAll(msg)
        // const messages = await bot.getChatHistory(chatId);
        if(text.toLowerCase() === 'привет' || text.toLowerCase() === '/start'){
            await bot.sendMessage(chatId, `Привет ${msg.from.first_name}`);
            //return bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/wheretocum/2.webp');
        }
        if(text.toLowerCase() === '/info'){
            return bot.sendMessage(chatId, `Вы : ${msg.from.first_name} ${msg.from.username}`);
        }
        if(text.toLowerCase() === '/game'){
            return startGame(chatId);
        }   
        if(text.toLowerCase() === '/gamestart'){
            const chatId = msg.chat.id;
            resetGame();
            return bot.sendMessage(chatId, 'Давай поиграем в крестики-нолики:\n' + getGameBoardAsString());
        }
          if(text.toLowerCase() === '/reset'){
            
            if (Array.isArray(allMessages)) {
                for (i = 0; i < allMessages.length; i++) {
                    await bot.deleteMessage(chatId, allMessages[i].message_id);
                };
                await bot.sendMessage(chatId, 'История очищена :))');
            } else {
                await bot.sendMessage(chatId, 'Ошибка: msg не является массивом');
            }
          }
        console.log(msg)
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
        
    })
}
start()

bot.on('callback_query', async msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    addMessagesToAll(msg)
    if (data === '/again'){
        return startGame(chatId);
    }
    if(Number(data) === chats[chatId]){
        await bot.sendMessage(chatId, `Поздравляем, вы выиграли, я загадал число ${chats[chatId]}`)
        return await bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/shblokun/6.webp', againOptions)
    }else{
        await bot.sendMessage(chatId, `Поздравляем, вы проиграли, я загадал число ${chats[chatId]}`)
        return await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/h/Hamster_StickerMixUA/Hamster_StickerMixUA_001.webp', againOptions)
    }
})
