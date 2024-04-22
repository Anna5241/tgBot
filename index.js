//44A5EF6B429D4694FD53408E2D28F5A1 - Kadinsky
//3b7e0d15-4e38-4995-8fe0-193c53b9b495 - погода

const ticTacToe = require('./ticTacToe.js');

const numbers = require('./numbers.js');

const photo_generation = require('./photo_generation.js');

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
        { command: '/photo_generation', description: 'Генератор фотографий'}
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
        if(text.toLowerCase() === '/photo_generation'){
            return photo_generation.generate_photo(msg, bot);
            
        }
        console.log(msg)        
    })
}
start()


