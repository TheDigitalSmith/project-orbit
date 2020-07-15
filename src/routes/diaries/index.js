const express=require('express')

const diaryRouter=express.Router()

const Diary=require('../../schemas/diary')

const language = require('@google-cloud/language')
const client = new language.LanguageServiceClient()

/* const text = 'subject = Doctor appointment, Today my sister called, she is angry with me, because I did not return her call. I am sad and tired. \
I do not want to talk with any one, not my sister, not my brother and not my father. They don\'t understand what I am \
feeling. I woke up every day with chest pain, I wish I knew when this is going to stop' */

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
        
        // 1. Sentiment Analysis
        const results = await client.analyzeSentiment({document: document})
        const sentiment = results[0].documentSentiment;
        console.log(sentiment);
        console.log('Text: &s', req.body.text);
        console.log('Sentiment score: &s', sentiment.score);
        console.log('Sentiment magnitude: &s', sentiment.magnitude);

        // 2. Detecting entities in the document
        const [result] = await client.analyzeEntities({document: document});
        const entities = result.entities;
        
        console.log('Entities:');
        entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
        }
        });

        // 3. Classifying text in the document
        const [classification] = await client.classifyText({document: document});
        console.log('Categories:');
        classification.categories.forEach(category => {
            console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
        });

        // 4. Detecting the syntax of the document
        // Need to specify an encodingType to receive word offsets
        const encodingType = 'UTF8';
        
        // Detects the syntax of the document
        const [syntax] = await client.analyzeSyntax({document, encodingType});
        
        console.log('Tokens:');
        syntax.tokens.forEach(part => {
            console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
            console.log('Morphology:', part.partOfSpeech);
        });

        const diary = await Diary.create({
            text: req.body.text, 
            score: sentiment.score, 
            magnitude: sentiment.magnitude,
            entities: entities,
            categories: classification.categories,
            tokens: syntax.tokens
        })

        res.json(diary)

    }catch(err){
        console.log(err)
    }
})

module.exports=diaryRouter