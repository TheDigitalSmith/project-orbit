const mongoose=require('mongoose')

const diarySchema=new mongoose.Schema ({
    text:String,
    score: Number,
    magnitude: Number
})

const Diary=mongoose.model('diary', diarySchema)

module.exports = Diary