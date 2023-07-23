const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose"); //{ default: mongoose } = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

// console.log("mongodb+srv://places:2n0ZeUXZlp7OLVrr@cluster0.blhlj9j.mongodb.net/?retryWrites=true&w=majority")
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

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
        password:bcrypt.hashSync('password, bcryptSalt'),
    });

    res.json(userDoc);
});


app.post('/registerB', async (req,res) => {
    const {first_name, last_name, username, property, phone, email, password} = req.body;
    const userDoc = await User.create({
        first_name,
        last_name,
        username,
        property,
        phone,
        email,
        password:bcrypt.hashSync('password, bcryptSalt'),
    });

    res.json(userDoc);
});

app.listen(4000);
