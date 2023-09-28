const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const Review = require('./models/Review.js');
const cookieParser = require('cookie-parser');
const { json2xml } = require('xml-js');

require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(8);
// const jwtSecret = "jwtSecret0";
const jwtSecretUser = "jwtSecretUser1";
const jwtSecretAdmin = "jwtSecretAdmin2";

const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const opencage = require('opencage-api-client'); //for map

app.use(express.json());
app.use(cookieParser());
app.use('/Uploads', express.static(__dirname + '/Uploads'));
app.use('/Uploads/profilePhotos', express.static(__dirname + '/Uploads/profilePhotos'));

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

app.get('/test', (req, res) => {
    res.json('test');
});

// wZPJCkcvDJZj7dTJ
// 2n0ZeUXZlp7OLVrr

///verification functions for admin
const verifyJWTadmin = (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretAdmin, {}, async (err, adminData) => {
            if (err) {
                return res.status(401).json({ error: 'Admin Token verification failed' });
            }
            req.id = adminData.id;
            // console.log("correct verification for admin ")
            next();
        });
    } else {
        res.status(401).json({ error: 'Token for admin not provided' });
    }
};
/// verification functions for user
const verifyJWTuser = (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) {
                return res.status(401).json({ error: 'User Token verification failed' });
            }
            req.id = userData.id;
            // console.log("correct verification for user ")
            next();
        });
    } else {
        res.status(401).json({ error: 'Token for user not provided' });
    }
};

//
// --------------------------------------------------------------------------------------
// USER - resgisteratiom - login - logout

app.post('/register', async (req, res) => {
    const { first_name, last_name, username, phone, email, password, profilephoto, host, tenant, isApproved } = req.body;
    try {
        const userDoc = await User.create({
            first_name,
            last_name,
            username,
            profilephoto,
            phone,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            host,
            tenant,
            isApproved
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

const photosMiddlewareProfile = multer({ dest: 'Uploads/profilePhotos/' })
app.post('/upload-profilePhoto', photosMiddlewareProfile.array('profilephoto', 1), async (req, res) => {
    const uploadedFiles = []; // Use an array, not an empty string
    try {
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newFile = 'profilePhoto_newUser_' + Date.now() + '.' + ext;
            const newPath = __dirname + '/Uploads/profilePhotos/' + newFile;
            fs.renameSync(path, newPath);
            uploadedFiles.push(newFile); // Push the new file name to the array
        }
        res.json(uploadedFiles); // Send the array of uploaded files
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Image upload failed' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (userDoc) {
        const passOK = bcrypt.compareSync(password, userDoc.password);
        if (passOK) {
            if (userDoc.isAdmin) { //token for admin authentication
                jwt.sign({
                    email: userDoc.email, //should this be changed??
                    id: userDoc._id
                }, jwtSecretAdmin, {/*expiresIn: 10h*/ }, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc);
                });
            } else { //token for user authentication
                jwt.sign({
                    email: userDoc.email, //should this be changed??
                    id: userDoc._id
                }, jwtSecretUser, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc);
                });
            }

        } else {
            res.status(422).json('Wrong password'); //we should put the apropriate messages for the user
        }
    } else {
        res.status(404).json('User not found');  //we should put the apropriate messages for the user
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            // if (err) throw err;
            if (userData && userData.id) {
                const { first_name, last_name, username, profilephoto, phone, email, host, tenant, isApproved, isAdmin } = await User.findById(userData.id); //fetch from the database
                res.json({ first_name, last_name, username, profilephoto, phone, email, host, tenant, isApproved, isAdmin });
            } else {
                res.json(null);
            }
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/update-profile', verifyJWTuser, async (req, res) => {
    try {
        const userId = req.id;
        const { first_name, last_name, username, profilephoto, phone, email } = req.body; {/*profilephoto,*/ }
        await User.updateOne({ _id: userId }, {
            $set: {
                first_name: first_name,
                last_name: last_name,
                username: username,
                profilephoto: profilephoto,
                phone: phone,
                email: email
            }
        });
        res.status(200).json("Profile Updated");
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Updating profile failed' });
    }
});

app.post('/check-password', verifyJWTuser, async (req, res) => {
    try {
        const userId = req.id;
        const { current_password } = req.body;
        const { password } = await User.findById(userId);

        const passOK = bcrypt.compareSync(current_password, password);
        if (passOK) {
            res.json(true)
        } else {
            res.json(false);
        }
    } catch (error) {
        console.error('Error checking password:', error);
        res.status(500).json({ error: 'Checking password failed' });
    }
});

app.post('/change-password', verifyJWTuser, async (req, res) => {
    try {
        const userId = req.id;
        const { new_password } = req.body;
        await User.updateOne({ _id: userId }, {
            $set: {
                password: bcrypt.hashSync(new_password, bcryptSalt)
            }
        });
        res.status(200).json("Password changed");

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Changing password failed' });
    }
});

//
// --------------------------------------------------------------------------------------
// ADMIN

app.get('/profile-admin', verifyJWTadmin, async (req, res) => {
    const adminId = req.id;
    if (adminId) {
        const { first_name, last_name, username, phone, email, host, tenant, isAdmin } = await User.findById(adminId);
        res.json({ first_name, last_name, username, phone, email, host, tenant, isAdmin });
    } else {
        res.json(null);
    }
});

app.post('/update-profile-admin', verifyJWTadmin, async (req, res) => {
    try {
        const adminId = req.id;
        const { first_name, last_name, username, profilephoto, phone, email } = req.body; {/*profilephoto,*/ }
        await User.updateOne({ _id: adminId }, {
            $set: {
                first_name: first_name,
                last_name: last_name,
                username: username,
                profilephoto: profilephoto,
                phone: phone,
                email: email
            }
        });
        res.status(200).json("Profile Updated");
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Updating profile failed' });
    }
});

app.post('/check-password-admin', verifyJWTadmin, async (req, res) => {
    try {
        const adminId = req.id;
        const { current_password } = req.body;
        const { password } = await User.findById(adminId);

        const passOK = bcrypt.compareSync(current_password, password);
        if (passOK) {
            res.json(true)
        } else {
            res.json(false);
        }
    } catch (error) {
        console.error('Error checking password:', error);
        res.status(500).json({ error: 'Checking password failed' });
    }
});

app.post('/change-password-admin', verifyJWTadmin, async (req, res) => {
    try {
        const adminId = req.id;
        const { new_password } = req.body;
        await User.updateOne({ _id: adminId }, {
            $set: {
                password: bcrypt.hashSync(new_password, bcryptSalt)
            }
        });
        res.status(200).json("Password changed");

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Changing password failed' });
    }
});


app.get('/users', async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretAdmin, {}, async (err, adminData) => {
            if (adminData && adminData.id) {
                res.json((await User.find()).filter(user => user.id !== adminData.id));
            } else {
                res.json(null);
            }
        });
    } else {
        res.json(null);
    }
});

app.get('/hosts', async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretAdmin, {}, async (err, adminData) => {
            if (adminData && adminData.id) {
                res.json((await User.find()).filter(user => user.host === true));
            } else {
                res.json(null);
            }
        });
    } else {
        res.json(null);
    }
});

app.get('/tenants', async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecretAdmin, {}, async (err, adminData) => {
            if (adminData && adminData.id) {
                res.json((await User.find()).filter(user => user.tenant === true));
            } else {
                res.json(null);
            }
        });
    } else {
        res.json(null);
    }
});
// should make a verification function for admin and user
app.post('/delete-user', verifyJWTadmin, async (req, res) => {
    try {
        //user id and token for verification
        const { userId } = req.body;
        const places = await Place.find({owner: userId});
        const placesId = places.map((place) => place._id);
        await Booking.deleteMany({place: { $in: placesId } }); //delete the bookings
        await Place.deleteMany({owner: userId}); //delete his places
        await User.deleteOne({ _id: userId }); //delete the user
        //and the photosssss
        res.status(200).json("User Deleted");
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Delete user failed' });
    }
});

app.post('/accept-host', verifyJWTadmin, async (req, res) => {
    try {
        const { userId } = req.body;
        await User.updateOne({ _id: userId }, {
            $set: {
                isApproved: true
            }
        });
        // res.status(200).json("Host Accepted");
        res.cookie('showMessage', 'true').send('User declined successfully');
    } catch (error) {
        console.error('Error approving a user:', error);
        res.status(500).json({ error: 'Approve user failed' });
    }
});

app.post('/decline-host', verifyJWTadmin, async (req, res) => {
    try {
        const { userId } = req.body;
        await User.updateOne({ _id: userId }, {
            $set: {
                isApproved: true,
                host: false
            }
        });
        res.status(200).json("Host Declined");
    } catch (error) {
        console.error('Error declining a user:', error);
        res.status(500).json({ error: 'Decline user failed' });
    }
});

app.get('/admin-user-places/:id', verifyJWTadmin, async (req, res) => {
    try {
        const { id } = req.params;
        res.json(await Place.find({ owner: id }));
    } catch (error) {
        console.error('Error finding places:', error);
        res.status(500).json({ error: 'Fiding places failed' });
    }
});

app.get('/admin-host-bookings/:id', verifyJWTadmin, async(req, res) => {
    try {
        const { id } = req.params;
        const places = await Place.find({ owner: id });
        res.json(await Booking.find({ 'place': places }));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bookings' });
    }
});

app.get('/admin-tenant-bookings/:id', verifyJWTadmin, async(req, res) => {
    try {
        const { id } = req.params;
        res.json(await Booking.find({ user: id }).populate('place'));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bookings' });
    }
});

app.get('/user/:id', verifyJWTadmin, async (req, res) => {
    try {
        const { id } = req.params;
        res.json(await User.findById(id));
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Fiding user failed' });
    }
});

app.get('/JSON-data', verifyJWTadmin, async (req, res) => {
    try {
        res.json(await Place.find());
    } catch (error) {
        console.error('Error at exporting data:', error);
        res.status(500).json({ error: 'Exporting data failed' });
    }
});

app.get('/XML-data', verifyJWTadmin, async (req, res) => {
    try {
        // res.json(await Place.find()); 
        const data = await Place.find();
        const jsonData = JSON.stringify(data, null, 2);
        const xmlData = json2xml(jsonData, { compact: true, spaces: 4 });
        res.json(xmlData);
    } catch (error) {
        console.error('Error at exporting data:', error);
        res.status(500).json({ error: 'Exporting data failed' });
    }
});

//
// --------------------------------------------------------------------------------------
// PLACES PAGE - make new place - update existing place

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newFile = 'photo_' + Date.now() + '.jpg';
    const imagePath = __dirname + '/Uploads/' + newFile;
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Image download failed');
        }
        const buffer = await response.buffer();
        fs.writeFileSync(imagePath, buffer);

        res.json(newFile);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Image download failed' });
    }
});

const photosMiddleware = multer({ dest: 'Uploads/' })
app.post('/upload-photos', photosMiddleware.array('photos', 50), async (req, res) => {
    const uploadedFiles = [];
    try {
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            // const newPath = path + '.' + ext;
            const newFile = 'photo_' + Date.now() + '.' + ext; // Generate the new filename
            const newPath = __dirname + '/Uploads/' + newFile; // Construct the new path
            fs.renameSync(path, newPath);
            uploadedFiles.push(newFile);
            // const url = await uploadToS3(path, originalname, mimetype);
            // uploadedFiles.push(url);
        }
        res.json(uploadedFiles);
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Image download failed' });
    }
});

// get the pin of the map
app.get('/mapCord/:address', async (req, res) => {
    const { address } = req.params;
    opencage
        .geocode({ q: address })
        .then((data) => {
            // console.log(JSON.stringify(data));
            if (data.status.code === 200 && data.results.length > 0) {
                const place = data.results[0];
                res.json(place.geometry);
            } else {
                console.log('Status', data.status.message);
                console.log('total_results', data.total_results);
            }
        })
        .catch((error) => {
            console.log('Error', error.message);
            if (error.status.code === 402) {
                console.log('Sorry...hit free trial daily limit');
            }
        });
})

// upload a new place
app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, pinPosition,
        extraInfoAddress, addedPhotos,
        description, perks, extraInfo, category,
        checkIn, checkOut, maxGuests, numBaths,
        maxBeds, numBedrooms, extraPrice, selectedDays,
        area, minDays, price } = req.body;
    try {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) throw err;
            const placeDoc = await Place.create({
                owner: userData.id,
                title, address, pinPosition,
                photos: addedPhotos, extraInfoAddress,
                description, perks, extraInfo, category,
                checkIn, checkOut, maxGuests, numBaths,
                maxBeds, numBedrooms, area, minDays,
                price, extraPrice, selectedDays
            });
            res.json(placeDoc);
        })
    } catch (err) {
        res.status(500).json({ error: 'Error uploading place' });
    }
});

// get the places of this user-host
app.get('/user-places', async (req, res) => {
    const { token } = req.cookies;
    try {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) throw err;
            const { id } = userData;
            res.json(await Place.find({ owner: id }));
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching places' });
    }
});

// get the place=id 
app.get('/places/:id', verifyJWTuser, async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    try {
        const place = await Place.findById(id).exec();
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching place' });
    }
});

// update the place=id
app.put('/places/:id', async (req, res) => {
    try {
        const { token } = req.cookies;
        const { id, title, address, pinPosition,
            extraInfoAddress, addedPhotos,
            description, perks,
            category, extraInfo, selectedDays,
            checkIn, checkOut, maxGuests,
            numBaths, maxBeds, numBedrooms,
            area, minDays, price, extraPrice } = req.body;

        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            const place = await Place.findById(id).exec();

            if (!place) {
                return res.status(404).json({ error: 'Place not found' });
            }
            if (userData.id !== place.owner.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Update the place data
            place.title = title;
            place.address = address;
            place.pinPosition = pinPosition;
            place.extraInfoAddress = extraInfoAddress;
            place.photos = addedPhotos;
            place.description = description;
            place.perks = perks;
            place.category = category;
            place.extraInfo = extraInfo;
            place.checkIn = checkIn;
            place.checkOut = checkOut;
            place.maxGuests = maxGuests;
            place.numBaths = numBaths;
            place.maxBeds = maxBeds;
            place.numBedrooms = numBedrooms;
            place.area = area;
            place.minDays = minDays;
            place.price = price;
            place.extraPrice = extraPrice;
            place.selectedDays = selectedDays;
            // Save the updated place
            await place.save();

            res.json({ message: 'Place updated successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching place' });
    }
});

//
// --------------------------------------------------------------------------------------
// PLACE page

// get the place=id 
app.get('/place/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    // console.log("Fetching place (from indexpage) with ID:", id);    
    try {
        const place = await Place.findById(id).exec();
        const host = await User.findOne({ _id: place.owner }).exec();
        const reviews = await Review.find({place: id}).exec();
        res.json({
            place: place, host: {
                "username": host.username,
                "photoprofile": host.profilephoto
            },
            reviews,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching place' });
    }
});

//booking page
app.post('/booking', (req, res) => {
    const { token } = req.cookies;
    const {
        place, checkIn, checkOut, numGuests, stayNights,
        first_name, last_name, phone, email, price, extraPrice
    } = req.body;
    try {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) throw err;
            const bookingDoc = await Booking.create({
                place, user: userData.id, checkIn, checkOut, numGuests, stayNights,
                first_name, last_name, phone, email, price, extraPrice
            })
            res.json(bookingDoc);
        });

    } catch (err) {
        res.status(500).json({ error: 'Error making the booking' });
    }
});

//
// --------------------------------------------------------------------------------------
// Booking page 

// get your bookigns 
app.get('/bookings', (req, res) => {
    const { token } = req.cookies;
    try {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) throw err;
            res.json(await Booking.find({ user: userData.id }).populate('place'));
            // **Querying with .populate()**: When you use .populate('place') in your query,
            //  it tells Mongoose to retrieve the referenced Place document(s) associated with each Booking document in the result.
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bookings' });
    }
});

// get the bookings a host for his place(s)
app.get('/bookings-host', verifyJWTuser, async (req, res) => {
    try {
        const places = await Place.find({ owner: req.id });
        const bookings = await Booking.find({ 'place': places });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings for the host:', error);
        res.status(500).json({ error: 'Error fetching bookings for the host' });
    }
});

//
// --------------------------------------------------------------------------------------
// Reviews

// make a review
app.post('/review', async (req, res) => {
    const { token } = req.cookies;
    const {
        place, booking, first_name, stars, review, reviewDate
    } = req.body;
    try {
        jwt.verify(token, jwtSecretUser, {}, async (err, userData) => {
            if (err) throw err;

            const user = await User.findById(userData.id);
            if (!user) 
                throw new Error('User not found');
            
            const photoprofile = user.profilephoto[0] || null;

            const reviewDoc = await Review.create({
                place, user: userData.id, booking, 
                first_name, photoprofile ,stars, review, reviewDate
            })
            res.json(reviewDoc);
        });

    } catch (error) {
        console.error('Error at Saving a new review:', error);
        res.status(500).json({ error: 'Error saving a new review' });
    }
});

// get a review id= booking._id
app.get('/review/:id', verifyJWTuser, async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findOne({ booking: id });
        // if (reviews.length === 0) {
        //     return res.status(404).json({ error: 'Review not found' });
        // }
        res.json(review);
    } catch (error) {
        console.error('Error fetching the review:', error);
        res.status(500).json({ error: 'Error fetching the review' });
    }
});

// find the reviews for one place
app.get('/reviews-place/:id', verifyJWTuser, async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await Review.find({ place: id });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching the review:', error);
        res.status(500).json({ error: 'Error fetching the review' });
    }
});


//
// --------------------------------------------------------------------------------------
// Home Page

// get every place 
// app.get('/places', async (req, res) => {
//     res.json(await Place.find());
// })

app.get('/places', async (req, res) => {
    try {
        const placesWithAvgRating = await Place.aggregate([
            {
                $lookup: {
                    from: 'reviews', // Your reviews collection name
                    localField: '_id',
                    foreignField: 'place',
                    as: 'reviews',
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    photos: { $arrayElemAt: ['$photos', 0] },
                    maxGuests: '$maxGuests',
                    numBedrooms: '$numBedrooms', // Include numBedrooms field
                    price: '$price', 
                    averageRating: {
                        $avg: '$reviews.stars',
                    },
                },
            },
        ]);
        res.json(placesWithAvgRating);
    } catch (error) {
        console.error('Error fetching places with average ratings:', error);
        res.status(500).json({ error: 'Error fetching places' });
    }
});


//
// -------------------------------------------------------------------------------------
//

app.listen(4000);
