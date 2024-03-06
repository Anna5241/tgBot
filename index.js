//44A5EF6B429D4694FD53408E2D28F5A1

const ticTacToe = require('./ticTacToe.js');

const numbers = require('./numbers.js');

const TelelegramApi = require('node-telegram-bot-api')

const tocken = "6945321356:AAG91Nc-JZfQB-KKvl0pSSMecSV-wjGgtvg"

const bot = new TelelegramApi(tocken, {polling: true})


const start = () =>{
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие'},
        { command: '/info', description: 'Информация о вас'},
        { command: '/numbers', description: 'Казино'},
        { command: '/reset', description: 'Очистить переписку'},
        { command: '/tic_tac_toe', description: 'Крестики нолики'},
        { command: '/weather', description: 'Погода'}
    ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text.toLowerCase() === 'привет' || text.toLowerCase() === '/start'){
            await bot.sendMessage(chatId, `Привет ${msg.from.first_name}`);
            //return bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/wheretocum/2.webp');
        }
        if(text.toLowerCase() === '/info'){
            return bot.sendMessage(chatId, `Вы : ${msg.from.first_name} ${msg.from.username}`);
        }
        if(text.toLowerCase() === '/numbers'){
            return numbers.startGame(chatId, bot);
        }   
        if(text.toLowerCase() === '/tic_tac_toe'){
            return ticTacToe.playTicTacToe(chatId, bot)

        }
        if(text.toLowerCase() === '/reset'){
            return bot.sendMessage(chatId, `Это пока не работает`);
        }
        if(text.toLowerCase() === '/weather'){
            const chat_id = '5520539019'
            // Отправка сообщения с запросом на нажатие кнопки
            // bot.onText(/\/pressbutton/, (msg) => {
            //     bot.sendMessage(chat_id, 'Нажмите на кнопку', {
            //     reply_markup: {
            //         inline_keyboard: [
            //         [{ text: 'Генерация изображения', callback_data: 'generate_image' }]
            //         ]
            //     }
            //     });
            // });
            bot.sendMessage(chat_id, 'Привет чмо')
            return bot.sendMessage(chatId, `тест`);
        }
        console.log(msg)        
    })
}
start()


