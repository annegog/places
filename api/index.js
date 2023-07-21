const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose"); //{ default: mongoose } = require('mongoose');
const User = require('./models/User.js');
const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

console.log("mongodb+srv://places:2n0ZeUXZlp7OLVrr@cluster0.blhlj9j.mongodb.net/?retryWrites=true&w=majority")
mongoose.connect('mongodb+srv://places:2n0ZeUXZlp7OLVrr@cluster0.blhlj9j.mongodb.net/?retryWrites=true&w=majority');

app.get('/test', (rew,res) => {
    res.json('test');
});

// wZPJCkcvDJZj7dTJ
// 2n0ZeUXZlp7OLVrr

app.post('/register', async (req,res) => {
    const {name, email, password} = req.body;
    const userDoc = await User.create({
        name,
        email,
        password,
    });

    res.json(userDoc);
});

app.listen(4000);
