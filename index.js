const express = require('express');
const dotenv = require('dotenv');
const listEndpoints = require('express-list-endpoints');
const app = express();

dotenv.config();

app.use(express.json());

app.get('/', (req,res)=>{
    console.log('Server running');
    res.send('Server up and running');
})

const port = process.env.PORT || 9000;
app.listen(3001,()=>{
    console.log(`App is launched on launchpad ${port}`);
})
console.log(listEndpoints(app));