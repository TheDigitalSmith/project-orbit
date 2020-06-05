const Disease = require('../../schemas/diseases');
const express = require('express');
const diseaseRouter = express.Router();

diseaseRouter.get('/', async(req,res)=>{
    try{
        const disease = await Disease.find({});
        res.json(disease);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})


diseaseRouter.post('/', async(req,res)=>{
    try{
    const newDisease = await Disease.create({...req.body});
    res.json(newDisease);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})


diseaseRouter.put('/:id', async(req,res)=>{
    try{
        const disease = await Disease.findByIdAndUpdate(req.params.id, {$set:{...req.body}},{new:true});
        res.json(disease);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})


diseaseRouter.delete('/:id', async(req,res)=>{
    try{
        const disease = await Disease.findByIdAndRemove(req.params.id);
        res.json({status:'Disease Successfully removed', disease})
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = diseaseRouter;