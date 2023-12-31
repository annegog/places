const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema object

const PlaceSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    address: String,
    country: {
        value: String,
        label: String,
    },
    pinPosition: [Number],
    extraInfoAddress: String, // about neib ect
    photos: [String],
    description: String,
    perks: [String],
    category: String,
    extraInfo: String,
    checkIn: String, 
    checkOut: String,
    maxGuests: Number,
    price: Number,
    extraPrice: Number,
    numBedrooms: Number,
    maxBeds: Number,
    numBaths: Number,
    area: Number,
    minDays: Number,
    arrive: Date,
    leave: Date
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
