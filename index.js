const TelelegramApi = require('node-telegram-bot-api')

const tocken = "6945321356:AAG91Nc-JZfQB-KKvl0pSSMecSV-wjGgtvg"

const bot = new TelelegramApi(tocken, {polling: true})

bot.on('message', msg =>{
    const text = msg.text;
    const chatId = msg.chat.id;
    if(text.toLowerCase() === 'привет'){
        bot.sendMessage(chatId, `Привет ${msg.from.first_name}`)
        
        bot.sendSticker(chatId, 'https://tgrm.su/img/stickers/wheretocum/2.webp')
    }
    console.log(msg)
    //bot.sendMessage(chatId, `Ты написал мне ${text}`)
})


