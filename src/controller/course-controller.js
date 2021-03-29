/**
 *
 */
import { Course } from '../model/Schemas/Course.js'

/**
 *
 */
export class CourseController {
  /**
   * Get index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async allCourses (req, res) {
    const courses = await Course.find({})
    return res.send(JSON.stringify(courses))
  }

  /**
   * @param req
   * @param res
   */
  async courseGroup (req, res) {
    console.log(req)
  }
}
