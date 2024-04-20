module.exports ={
    
    Styles: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text:'KADINSKY',callback_data:'/kadinsky'},{text:'UHD',callback_data:'/uhd'}],
                [{text:'ANIME',callback_data:'/anime'},{text:'DEFAULT',callback_data:'/default'}],
            ]
        })
    }
}