const express = require('express');
const dotenv = require('dotenv');
const mongoose = require ('mongoose');
const listEndpoints = require('express-list-endpoints');
const app = express();

const userRouter = require('./src/routes/users');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
},(err) => console.log(err ? err : "MongoDB connected"));

app.use(express.json());
app.use('/api/users', userRouter);

app.get('/', (req,res)=>{
    console.log('Server running');
    res.send('Server up and running');
})

const port = process.env.PORT || 9000;
app.listen(3001,()=>{
    console.log(`App is launched on launchpad ${port}`);
})
console.log(listEndpoints(app));