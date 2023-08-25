const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose"); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(8);
const jwtSecret = 'abcdefghijklmnopqrstuvwxyz';

const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs'); 

app.use(express.json());
app.use(cookieParser());
app.use('/Uploads', express.static(__dirname+'/Uploads'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.get('/test', (req,res) => {
    res.json('test');
});

// wZPJCkcvDJZj7dTJ
// 2n0ZeUXZlp7OLVrr

//
// --------------------------------------------------------------------------------------
//

app.post('/register', async (req,res) => {
    const {first_name, last_name, username, phone, email, password, host, tenant} = req.body;
    try{
        const userDoc = await User.create({
            first_name,
            last_name,
            username,
            phone,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
            host,
            tenant
        });
        res.json(userDoc);
    } catch(e){
        res.status(422).json(e);
    } 
});


app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username}); 
    if (userDoc) {   
        const passOK = bcrypt.compareSync(password, userDoc.password);
        if (passOK) {  
            jwt.sign({
                email:userDoc.email, //should this be changed??
                id:userDoc._id
              }, jwtSecret, {}, (err,token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
              });
        } else {
          res.status(422).json('Wrong password'); //we should put the apropriate messages for the user
        }
    } else {
        res.status(404).json('User not found');  //we should put the apropriate messages for the user
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {username, email, _id} = await User.findById(userData.id); //fetch from the database
            res.json({username, email, _id}); 
        });
    } else {
        res.json(null);
    }
    // res.json({token});
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

//
// --------------------------------------------------------------------------------------
// PLACES PAGE - make new place - update existing place

app.post('/upload-by-link', async (req,res) =>{
    const {link} = req.body;
    const newFile = 'photo_'+ Date.now()+'.jpg';
    try {
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/Uploads/' + newFile,
        });
        res.json(newFile);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Image download failed' });
    }
});

const photosMiddleware = multer({dest:'Uploads/'})
app.post('/upload-photos', photosMiddleware.array('photos', 50), async (req,res) =>{
    const uploadedFiles = [];
    try{
        for (let i = 0; i < req.files.length; i++) {
            const {path,originalname} = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length-1];
            const newPath = path + '.' + ext;
            fs.renameSync(path,newPath);
            uploadedFiles.push(newPath.replace('Uploads/', ''));
            // const url = await uploadToS3(path, originalname, mimetype);
            // uploadedFiles.push(url);
        }
        res.json(uploadedFiles);
    }catch(err){
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Image download failed' });
    }
});

// upload a new place
app.post('/places', (req,res) =>{
    const {token} = req.cookies;
    const {title, address, addedPhotos,
        photoLink, description, perks, extraInfo,
        checkIn, checkOut, maxGuests, numBaths,
        maxBeds, numBedrooms,
        area, minDays, price } = req.body;
    try{
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
            const placeDoc = await Place.create({  
                owner: userData.id, 
                title, address,
                photos: {
                    addedPhotos: addedPhotos,
                    photoLink: photoLink
                }, 
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests, numBaths,
                maxBeds, numBedrooms, area, minDays, price 
            });
            res.json(placeDoc);
        })
    }catch(err){
        res.status(500).json({ error: 'Error uploading place' });
    }
});

// get the places of this user-host
app.get('/places', async (req, res) => {
    const {token} = req.cookies;
    try{
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {id} = userData;
        res.json(await Place.find({owner:id})); 
        });
    } catch(error){
        res.status(500).json({ error: 'Error fetching places' });
    }
});

// get the place=id 
app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    console.log("Fetching place with ID:", id);    
    try {
      const place = await Place.findById(id).exec();
      res.json(place);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching place' });
    }
});

// update the place=id
app.put('/places/:id', async (req, res) => {
    const {token} = req.cookies;
    const {id, title, address, addedPhotos,
        photoLink, description, perks, extraInfo,
        checkIn, checkOut, maxGuests, numBaths,
        maxBeds, numBedrooms,
        area, minDays, price } = req.body;
    try {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            const place = await Place.findById(id).exec();
            if(userData.id === place.owner.toString()){
                place.set({ 
                    title, address, 
                    photos: {
                        addedPhotos: addedPhotos,
                        photoLink: photoLink
                    }, 
                    description, perks, extraInfo,
                    checkIn, checkOut, maxGuests, numBaths,
                    maxBeds, numBedrooms, area, minDays, price
                });
                await place.save();
                res.json('Update is ok'); 
            }
        });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching place' });
    }
});

//
// --------------------------------------------------------------------------------------
//

app.listen(4000);
