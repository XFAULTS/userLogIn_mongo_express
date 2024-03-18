const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { find } = require('./mongo_Model/userModel');
const PORT = 4000;

const userModel = require(path.join(__dirname,'mongo_Model','userModel.js'));

mongoose.connect('mongodb://localhost:27017').then(()=>{
    console.log("Database connected");
})

const app = express();
app.use(express.urlencoded());

app.post('/api/createAcc',(req,res)=>{
    res.render(path.join(__dirname,'public','createAcc.ejs'));
})

app.get('/api/createAcc',(req,res)=>{
    res.render(path.join(__dirname,'public','createAcc.ejs'));
})

app.post('/api/makeId', async(req,res)=>{
    let Name = req.body.userName;
    Name = Name.trim();
    const password = req.body.password;
    const findUser = await userModel.findOne({userName : Name }).lean();
    if(findUser && findUser.userName === Name){
        console.log("user already exist");
        res.redirect('/api/createAcc');
    }
    else{
        const newUser = await new userModel({
            userName: Name,
            password: password
        });
        newUser.save();
        res.redirect('/')
    }
})


app.post('/api/logInAcc',async (req,res)=>{
    let Name = req.body.userName;
    Name = Name.trim();
    let password = req.body.password;
    const findUser = await userModel.findOne({userName : Name }).lean();

    if(findUser && findUser.userName === Name){
        const DBpass = findUser.password;
        if(password === DBpass){
            res.render(path.join(__dirname,'public','homepage.ejs'));
        }
        else{
            console.log("wrong password")
            res.redirect('/')
        }
    }else{
        console.log("user not found");
        res.redirect('/');
    }
});


app.get('/', async(req,res)=>{
    res.render(path.join(__dirname,'public','logIn.ejs'));
});

app.listen(PORT,()=>{
    console.log(`Your server is runiing on port ${PORT}`);
})