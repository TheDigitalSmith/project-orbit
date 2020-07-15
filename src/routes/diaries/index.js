const express=require('express')

const diaryRouter=express.Router()

const Diary=require('../../schemas/diary')

const language = require('@google-cloud/language')
const client = new language.LanguageServiceClient()

const text = 'subject = Doctor appointment, Today my sister called, she is angry with me, because I did not return her call. I am sad and tired. \
I do not want to talk with any one, not my sister, not my brother and not my father. They don\'t understand what I am \
feeling. I woke up every day with chest pain, I wish I knew when this is going to stop'

diaryRouter.get('/',async(req, res)=>{
    const diary=await Diary.find({})
    res.json(diary)
})

diaryRouter.post('/',async(req, res)=>{
    const diary=await Diary.create({...req.body})
    res.json(diary)
})

diaryRouter.post('/ai',async(req, res)=>{
    try{
    const document = {
        content: req.body.text,
        type: 'PLAIN_TEXT'
    }
    
   const results = await client.analyzeSentiment({document: document})
   const sentiment = results[0].documentSentiment;
   console.log(sentiment);
    console.log('Text: &s', text);
    console.log('Sentiment score: &s', sentiment.score);
    console.log('Sentiment magnitude: &s', sentiment.magnitude);
    const diary = await Diary.create({text: req.body.text, score: sentiment.score, magnitude: sentiment.magnitude})
    res.json(diary)
}catch(err){
    console.log(err)
}
        // .then(results => {
        //     sentiment = results[0].documentSentiment;
    
        //     console.log(sentiment);
        //     console.log('Text: &s', text);
        //     console.log('Sentiment score: &s', sentiment.score);
        //     console.log('Sentiment magnitude: &s', sentiment.magnitude);
        //     diary = Diary.create({text: req.body.text, score: sentiment.score, magnitude: sentiment.magnitude})
        //     res.json(diary)
        // })
        // .catch(err => {
        //     console.error('ERROR:', err)
        // })
})

module.exports=diaryRouter