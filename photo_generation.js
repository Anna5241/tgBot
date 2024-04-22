module.exports = {
    generate_photo,
};



const {Styles} = require('./styles')

const fs = require("fs")
const axios = require("axios");
const FormData = require("form-data");

class Text2ImageAPI{
    constructor(url, apiKey, secretKey){
        this.URL = url;
        this.AUTH_HEADERS = {
            'X-Key': `Key ${apiKey}`,
            'X-Secret': `Secret ${secretKey}`
        };
    }

    async getModels(){
        const response = await axios.get(`${this.URL}key/api/v1/models`, {headers: this.AUTH_HEADERS});
        return response.data[0].id;
    }

    async generate(prompt, model, images = 1, width = 1024, height = 1024, style){
        console.log(style);
        const styles = ["KADINSKY", "UHD", "ANIME", "DEFAULT"];
        const params = {
            type: "GENERATE",
            numImages: images,
            width,
            height,
            style: styles[style],
            generateParams: {
                query: prompt
            }
        }
        const formData = new FormData();
        const modelIdData = { value: model, optoins: {contentType: null}};
        const paramsData = {value: JSON.stringify(params),options: {contentType: 'application/json'}};
        formData.append('model_id', modelIdData.value, modelIdData.optoins);
        formData.append('params', paramsData.value, paramsData.options);
        console.log("1")
        const response = await axios.post(`${this.URL}key/api/v1/text2image/run`, formData,{
            headers: {
                ...formData.getHeaders(),
                ...this.AUTH_HEADERS
                
            },
            'Content-Type': 'multipart/form-data'
        });
        console.log("2")
        const data = response.data;
        console.log("3")
        return data.uuid;
    };

    async checkGeneration(requestId, attempts = 10, delay = 10){
        while(attempts > 0){
            try{
                const response = await axios.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, {headers: this.AUTH_HEADERS});
                console.log(attempts);
                const data = response.data;
                console.log(data.status);
                if(data.status === 'DONE'){
                    return data.images;
                }
            }catch(error){
                console.error(error);
            }
            attempts--;
            await new Promise(resolve => setTimeout(resolve,delay*1000));
        }
    }
    
}

class Request{
    constructor(request = null, style = null, image = null){
        this.style = style;
        this.request = request;
        this.image = image;
    }
}

const chats = {
    request: 'value1',
    style: 'value2',
    image: '3'
// request: null,
// style: null,
// image: null
};

async function handleMessage(msg, bot) {
    const text = msg.text;
    console.log(text);
    chatId = msg.chat.id;
    if (!chats[chatId]) {
        chats[chatId] = {
            request: null,
            style: null
        };
    }
    chats[chatId].request = text;
    
    (async () => {
        let styleGot = false;
        let style;
        
        // if(!styleGot){
        //     style = await get_style(bot, chatId);
        //     styleGot = true;
        // }
        style = await get_style(bot, chatId);
        chats[chatId].style = style;
        console.log(style)
        //await bot.sendMessage(chatId, 'Подожди секунд 30, бот работает медленно('); 
        await bot.sendMessage(chatId, 'Wait 30 seconds, the bot is running slowly('); 
        const api = new Text2ImageAPI('https://api-key.fusionbrain.ai/', '8A9F802F384D45DB5BD74C83DEE93604', '44A5EF6B429D4694FD53408E2D28F5A1');
        const modelId = await api.getModels();
        const uuid = await api.generate(chats[chatId].request, modelId, 1, 1024, 1024, chats[chatId].style);
        const images = await api.checkGeneration(uuid);
        const base64String = images[0];
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
                
        fs.writeFile('image.jpg', buffer, 'base64', (err) => {
            if (err) {
                throw err;
            }
            
            console.log('Файл сохранён!');                   
            const photoPath = "C:/Users/xffaw/Desktop/tgBot/image.jpg";
                const photo = fs.createReadStream(photoPath)
                chats[chatId].image = photo;
                bot.sendPhoto(chatId, chats[chatId].image)
                .then((sent) => {
                    console.log('Фотография успешно отправлена');
                    //return setTimeout(() => { bot.sendMessage(chatId,`Можешь попросить нарисовать еще что-нибудь)`); }, 1000);
                    //return bot.sendMessage(chatId, `Это пока работает`);
                    setTimeout(() => { return bot.sendMessage(chatId,`You can ask me to draw something else)`); }, 1000);
                })
                .catch((error) => {
                    console.error('Ошибка при отправке фотографии:', error);
                });
            
            
                
                    
            });
        })(); 
    bot.removeListener('message', handleMessage);
}

async function generate_photo(msg, bot){
    chatId = msg.chat.id;
    //bot.sendMessage(chatId, `Введите запрос`);
    await bot.sendMessage(chatId, `Enter a request`);
    
    

    bot.on('message', (message) => {
        handleMessage(message, bot);
    })
    //bot.on('message', handleMessage);
    
}

function get_style(bot, chatId) {
    return new Promise((resolve, reject) => {
        startSt(chatId, bot);
        console.log("style")
        //bot.sendMessage(chatId, 'Выбираем стиль');  
        function callback(msg) {
            bot.removeListener('callback_query', callback); // удаляем обработчик после выполнения
            const data = msg.data;
            let style = null;
            if (data === '/kadinsky') {
                style = 0;
            } else if (data === '/uhd') {
                style = 1;
            } else if (data === '/anime') {
                style = 2;
            } else if (data === '/default') {
                style = 3;
            }
            resolve(style);
        }
        bot.on('callback_query', callback);
        
    });
}

const startSt = async (chatId, bot) =>{
    //await bot.sendMessage(chatId,'Выберите стиль', Styles);
    await bot.sendMessage(chatId,'Choose the style', Styles);
}

async function waitForResponse() {
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            //reject("Время ожидания ответа истекло.");
        }, 60000); // Ожидание 5 секунд

        // Проверка наличия ответа
        function checkResponse() {
            if (userInput !== '' || userInput !== null) {
                clearTimeout(timer);
                resolve("Ответ получен.");
            } else {
                setTimeout(checkResponse, 1000); // Проверять каждую секунду
            }
        }

        checkResponse();
    });
}

// Вызов функции и ожидание ответа



