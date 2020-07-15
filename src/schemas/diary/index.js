const mongoose=require('mongoose')

const diarySchema=new mongoose.Schema ({
    text:String,
    score: Number,
    magnitude: Number,
    entities: Array,
    categories: Array,
    tokens: Array
})

const Diary=mongoose.model('diary', diarySchema)

module.exports = Diary