module.exports = {
    startGame,
};

const {gameOptions, againOptions} = require('./options')

let chats = {

};


const start = async (chatId, bot) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен будешь его отгадать'); 
    const randomNumber = Math.floor(Math.random()* 10);
    chats[chatId] = randomNumber;
    setTimeout(() => { bot.sendMessage(chatId,'Отгадывай', gameOptions); }, 1000);
}

function startGame(chatId, bot){
    start(chatId, bot);
    bot.on('callback_query', async msg =>{
        const data = msg.data;
        if (data === '/again'){
            return start(chatId, bot);
        }
        else if(Number(data) === chats[chatId]){
            await bot.sendMessage(chatId, `Поздравляем, вы выиграли, я загадал число ${chats[chatId]}`)
            return await bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/shblokun/6.webp', againOptions)
        }else{
            await bot.sendMessage(chatId, `Поздравляем, вы проиграли, я загадал число ${chats[chatId]}`)
            return await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/h/Hamster_StickerMixUA/Hamster_StickerMixUA_001.webp', againOptions)
        }
    })
}
