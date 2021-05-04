import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({

  message: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  anonym: { type: Boolean },
  studentID: { type: String, required: true },
  score: { type: Number } // thumbs up
})

export const Review = mongoose.model('Review', reviewSchema)
