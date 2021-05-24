/**
 *
 */
import { Course } from '../model/Schemas/Course.js'
import { Review } from '../model/Schemas/Review.js'
import TokenHelper from '../model/TokenHelper.js'

import { SCORE_REVIEW_FAIL, SCORE_REVIEW, POST_REVIEW_FAIL, GET_COURSE_BY_ID_FAILED, POST_REVIEW, EDIT_REVIEW } from './types.js'

/**
 *
 */
export class CourseController {
  /**
   * Initializes an instance of tokenHelper.
   */
  constructor () {
    this._tokenHelper = new TokenHelper()
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

    const result = []
    coursesByTitle.forEach(c => { result.push(c) })
    coursesByID.forEach(c => { result.push(c) })

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
    const courseID = req.body.courseID
    const token = req.body.token
    let userName = ''
    if (token) {
      userName = this._tokenHelper.verifyToken(token).data
    }

    const course = await Course.find({ courseID: courseID.toUpperCase() })
    if (course.length > 0) {
      const courseReviews = await Review.find({ courseID: courseID.toUpperCase() })

      let totalRating = 0
      // hide anonymous users from the client
      for (let i = 0; i < courseReviews.length; i++) {
        // let student see their own reviews.
        if (courseReviews[i].anonymous && courseReviews[i].studentID !== userName) {
          courseReviews[i].studentID = 'Anonym'
        }
        totalRating += courseReviews[i].rating
      }

      const reviews = { totalRating: totalRating / courseReviews.length, courseReviews }
      return res.status(200).json({ course: course[0], review: reviews })
    } else {
      return res.status(200).json(GET_COURSE_BY_ID_FAILED) // not found!
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
    const exist = await Review.find({ courseID: courseID.toUpperCase(), studentID: req.body.studentID })

    if (exist.length > 0) {
      return res.status(200).json({ POST_REVIEW_FAIL, message: 'Du kan inte recensera samma kurs flera gånger.' })
    }
    if (res.locals.userName !== req.body.studentID) {
      // access denied!.
      return res.status(403).json('Wrong user.')
    }
    if (course.length > 0) {
      newReview.courseID = courseID.toUpperCase()
      newReview.message = req.body.message
      newReview.rating = req.body.rating

      newReview.anonymous = req.body.anonymous
      newReview.studentID = req.body.studentID
      await newReview.save()
      return res.status(200).json(POST_REVIEW)
    } else {
      return res.status(200).json({ POST_REVIEW_FAIL, message: 'Kan inte hitta kursen' })
    }
  }

  /**
   * Change a existing review with new content.
   * Note that in order to get to this call verify token must return true.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - response
   */
  async editReview (req, res) {
    const reviewID = req.body.reviewID
    const message = req.body.message
    const rating = req.body.rating
    const anonymous = req.body.anonymous
    const studentID = req.body.studentID

    const review = await Review.findById(reviewID)
    if (review) {
      review.message = message
      review.rating = rating
      review.anonymous = anonymous
      review.studentID = studentID

      await review.save()
      return res.status(200).json(EDIT_REVIEW)
    } else {
      return res.status(200).json({ EDIT_REVIEW_FAIL, message: 'Kan inte hitta review.' })
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
        return res.status(200).json({ SCORE_REVIEW_FAIL, message: 'Du kan inte rata din egen review.' })
      }

      if (review.score.includes(res.locals.userName)) {
        const index = review.score.indexOf(res.locals.userName)

        if (index > -1) {
          review.score.splice(index, 1)
        }
      } else {
        review.score.push(res.locals.userName)
      }

      await review.save()
      return res.status(200).json(SCORE_REVIEW)
    }
  }
}
