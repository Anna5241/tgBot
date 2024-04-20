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
        const response = await axios.post(`${this.URL}key/api/v1/text2image/run`, formData,{
            headers: {
                ...formData.getHeaders(),
                ...this.AUTH_HEADERS
            },
            'Content-Type': 'multipart/form-data'
        });
        const data = response.data;
        return data.uuid;
    };

    async checkGeneration(requestId, attempts = 10, delay = 10){
        while(attempts > 0){
            try{
                const response = await axios.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, {headers: this.AUTH_HEADERS});
                const data = response.data;
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

function  generate_photo(chatId, bot){
    bot.sendMessage(chatId, `Введите запрос`);
    bot.on('message', (msg) => { 
        const text = msg.text;
        console.log(text);
    
        (async () => {
            const style = await get_style(bot, chatId);
            console.log(style)
            await bot.sendMessage(chatId, 'Подожди секунд 30, бот работает медленно(');  
            const api = new Text2ImageAPI('https://api-key.fusionbrain.ai/', '8A9F802F384D45DB5BD74C83DEE93604', '44A5EF6B429D4694FD53408E2D28F5A1');
            const modelId = await api.getModels();
            const uuid = await api.generate(text, modelId, 1, 1024, 1024, style);
            const images = await api.checkGeneration(uuid);
            const base64String = images[0];
            const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
                    
            fs.writeFile('image.jpg', buffer, 'base64', (err) => {
                if (err) {
                    throw err;
                }
                console.log('Файл сохранён!');                   
                const photoPath = "C:/Users/миша/OneDrive/Рабочий стол/tgBot/tgBot/image.jpg";
                bot.sendPhoto(chatId, fs.createReadStream(photoPath))
                    .then((sent) => {
                        console.log('Фотография успешно отправлена');
                        return setTimeout(() => { bot.sendMessage(chatId,`Можешь попросить нарисовать еще что-нибудь)`); }, 1000);
                        //return bot.sendMessage(chatId, `Это пока работает`);
                    })
                    .catch((error) => {
                        console.error('Ошибка при отправке фотографии:', error);
                    });
                    
                        
                });
            })(); 
                    
        }); 
}
function get_style(bot, chatId) {
    return new Promise((resolve, reject) => {
        start(chatId, bot);

        bot.on('callback_query', async msg => {
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
        });
    });
}

const start = async (chatId, bot) =>{
    await bot.sendMessage(chatId,'Выберите стиль', Styles);
}



