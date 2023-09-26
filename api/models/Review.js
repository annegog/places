const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
  user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  booking: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking'},
  first_name: {type:String, required:true},
  stars: Number,
  review: String,
  reviewDate: Date,
  photoprofile: String,
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;