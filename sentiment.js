const language = require('@google-cloud/language')
const client = new language.LanguageServiceClient()

const text = 'subject = Doctor appointment, Today my sister called, she is angry with me, because I did not return her call. I am sad and tired. \
I do not want to talk with any one, not my sister, not my brother and not my father. They don\'t understand what I am \
feeling. I woke up every day with chest pain, I wish I knew when this is going to stop'

const document = {
    content: text,
    type: 'PLAIN_TEXT'
}

client.analyzeSentiment({document: document})
    .then(results => {
        const sentiment = results[0].documentSentiment;

        console.log(sentiment);
        console.log('Text: &s', text);
        console.log('Sentiment score: &s', sentiment.score);
        console.log('Sentiment score: &s', sentiment.magnitude);
    })
    .catch(err => {
        console.error('ERROR:', err)
    })

