import axios from "axios";
import FormData from "form-data";
import fs from "fs";

class Text2ImageAPI{
    constructor(url, apiKey, secretKey){
        this.URL = url;
        this.AUTH_HEADERS = {
            'X-Key': 'Key ${apiKey}',
            'X-Secret': 'Secret ${secretKey}'
        };
    }

    async getModels(){
        const response = await axious.get('${this.URL}key/api/v1/models', {headers: this.AUTH_HEADERS});
        return response.data[0].id;
    }

    async generate(prompt, model, images = 1, width = 1024, height = 1024, style = 3){
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
    };
}

