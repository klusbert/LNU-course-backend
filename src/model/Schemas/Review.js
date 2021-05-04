import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({

  courseID: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  anonymous: { type: Boolean },
  studentID: { type: String, required: true },
  score: [] // list of student who liked this review.
})

export const Review = mongoose.model('Review', reviewSchema)
