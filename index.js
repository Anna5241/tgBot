const TelelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./Option')

const tocken = "6945321356:AAG91Nc-JZfQB-KKvl0pSSMecSV-wjGgtvg"

const bot = new TelelegramApi(tocken, {polling: true})

const chats = {}


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
         { command: '/reset', description: 'Очистить переписку'}
     ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        // const messages = await bot.getChatHistory(chatId);
        if(text.toLowerCase() === 'привет' || text.toLowerCase() === '/start'){
           await bot.sendMessage(chatId, `Привет ${msg.from.first_name}`);
           return bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/wheretocum/2.webp');
        }
        if(text.toLowerCase() === '/info'){
            return bot.sendMessage(chatId, `Вы : ${msg.from.first_name} ${msg.from.username}`);
        }
        if(text.toLowerCase() === '/game'){
            return startGame(chatId);
        }   
        //  if(text.toLowerCase() === '/reset'){
        //     message.forEach(async (message) => {
        //         await bot.deleteMessage(chatId, message.message_id);
        //     });
        //     await bot.sendMessage(chatId, `История очищена :)`);
        //  }
        console.log(msg)
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
        
    })
}
start()

bot.on('callback_query', async msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again'){
        return startGame(chatId);
    }
    if(Number(data) === chats[chatId]){
         await bot.sendMessage(chatId, `Поздравляем, вы выиграли, я загадал число ${chats[chatId]}`, againOptions)
        return await bot.sendMessage(chatId, 'https://chpic.su/_data/stickers/h/Hamster_StickerMixUA/Hamster_StickerMixUA_001.webp')
    }else{
         await bot.sendMessage(chatId, `Поздравляем, вы проиграли, я загадал число ${chats[chatId]}`, againOptions)
        return await bot.sendMessage(chatId, 'https://chpic.su/_data/stickers/h/Hamster_StickerMixUA/Hamster_StickerMixUA_001.webp')
    }
})