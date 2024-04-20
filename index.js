//44A5EF6B429D4694FD53408E2D28F5A1
// import { Text2ImageAPI } from './kand.js';

const fs = require("fs")

const ticTacToe = require('./ticTacToe.js');

const numbers = require('./numbers.js');

const Text2ImageAPI = require('./kand.js');
// const kand = require('./kand.js');
// const kand =  import('./kand.js');

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
            bot.sendMessage(chatId, `Введите запрос`);
            fileWrote = false;
            bot.on('message', (msg) => {
                const text = msg.text;
                console.log(text);
                (async () => {
                    let fileWrote = false;
                    const api = new Text2ImageAPI('https://api-key.fusionbrain.ai/', '8A9F802F384D45DB5BD74C83DEE93604', '44A5EF6B429D4694FD53408E2D28F5A1');
                    const modelId = await api.getModels();
                    const uuid = await api.generate(text, modelId, 1, 1024, 1024, 1);
                    const images = await api.checkGeneration(uuid);
                    const base64String = images[0];
                    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    
                    fs.writeFile('image.jpg', buffer, 'base64', (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('Файл сохранён!');
                        fileWrote = true;
                
                        if (fileWrote) {
                            console.log("fileWrote");
                            const photoPath = "C:/Users/xffaw/Desktop/tgBot/image.jpg";
                            bot.sendPhoto(chatId, fs.createReadStream(photoPath))
                                .then((sent) => {
                                    console.log('Фотография успешно отправлена');
                                })
                                .catch((error) => {
                                    console.error('Ошибка при отправке фотографии:', error);
                                });
                                return bot.sendMessage(chatId, `Это пока работает`);
                        }
                    });
                })(); 
                
            }); 
            
        }
        console.log(msg)        
    })
}
start()


