const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema object

const PlaceSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    address: String,
    pinPosition: [Number],
    extraInfoAddress: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: String, 
    checkOut: String,
    maxGuests: Number,
    price: Number,
    numBedrooms: Number,
    maxBeds: Number,
    numBaths: Number,
    area: Number,
    minDays: Number
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
