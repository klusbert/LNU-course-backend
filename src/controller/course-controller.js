/**
 *
 */
import { Course } from '../model/Schemas/Course.js'

import { Review } from '../model/Schemas/Review.js'

/**
 *
 */
export class CourseController {
  /**
   * Get index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - Course list.
   */
  async allCourses (req, res) {
    const courses = await Course.find({})

    courses.sort((a, b) => (a.courseTitle > b.courseTitle) ? 1 : -1)
    res.json(courses)
  }

  /**
   * Finds coureses that belong to a specific group.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - Course list.
   */
  async courseGroup (req, res) {
    const query = req.params.query
    const regex = new RegExp(query, 'i')
    const courses = await Course.find({ courseGroup: { $regex: regex } })
    res.json(courses)
  }

  /**
   * Get courses by title.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - Course list.
   */
  async search (req, res) {
    const query = req.params.query

    const regex = new RegExp(query, 'i')
    const coursesByTitle = await Course.find({ courseTitle: { $regex: regex } })
    const coursesByID = await Course.find({ courseID: { $regex: regex } })
    const coursesByEnglishTitle = await Course.find({ courseTitleEnglish: { $regex: regex } })
    const result = []
    coursesByTitle.forEach(c => { result.push(c) })
    coursesByID.forEach(c => { result.push(c) })

    coursesByEnglishTitle.forEach(c => {
      // only add if we don't have it already...
      if (result.filter(e => e.courseID === c.courseID).length === 0) {
        result.push(c)
      }
    })

    result.sort((a, b) => (a.courseTitle > b.courseTitle) ? 1 : -1)
    res.json(result.map((course) => {
      return { courseTitle: course.courseTitle, courseID: course.courseID }
    }))
  }

  /**
   * Get specific course information.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - Course list.
   */
  async getCourse (req, res) {
    const courseID = req.params.query

    const course = await Course.find({ courseID: courseID.toUpperCase() })
    if (course.length > 0) {
      const courseReview = await Review.find({ courseID: courseID.toUpperCase() })

      console.log(courseReview.length)

      return res.status(200).json({ course: course, reviews: courseReview })
    } else {
      return res.status(404).json('Not found') // not found!
    }
  }

  /**
   * Adds a review to the system.
   * Note that only users with a valid token can post reviews.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - response
   */
  async addReview (req, res) {
    const newReview = new Review()

    const courseID = req.body.courseID

    // to support lowercase
    const course = await Course.find({ courseID: courseID.toUpperCase() })

    if (res.locals.userName !== req.body.studentID) {
      // access denied!.
      return res.status(403)
    }
    if (course.length > 0) {
      newReview.courseID = courseID.toUpperCase()
      newReview.message = req.body.message
      newReview.rating = req.body.rating
      newReview.anonymous = req.body.anonymous
      newReview.studentID = req.body.studentID
      await newReview.save()
      return res.status(200).json('success')
    } else {
      return res.status(404).json('Not found') // not found!
    }
  }

  /**
   * Add a score to a review(thumbs up!).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - response
   */
  async scoreReview (req, res) {
    const reviewID = req.body.reviewID
    const review = await Review.findById(reviewID)

    if (review) {
      if (res.locals.userName === review.studentID) {
        return res.status(403).json('You cannot score your own review.')
      }

      if (review.score.includes(res.locals.userName)) {
        return res.status(403).json('You can only score one course once!')
      }
      review.score.push(res.locals.userName)
      await review.save()
      return res.status(200).json('success')
    }
  }
}
