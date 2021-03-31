import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({

  courseTitle: { type: String, index: true },
  courseID: { type: String },
  courseLevel: { type: String },
  syllabus: { type: String },
  teachingLanguage: { type: String },
  courseGroup: { type: String },
  prerequisites: { type: String },
  courseURL: { type: String, unique: true },
  isDistance: { type: Boolean },
  courseSpeed: { type: Number }

})

export const Course = mongoose.model('Course', courseSchema)
