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
   * @returns {JSON} - Course list.
   */
  async allCourses (req, res) {
    const courses = await Course.find({})

    res.json(courses.map(c => c.courseTitle))
  }

  /**
   * Finds coureses that belong to a specific group
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {JSON} - Course list.
   */
  async courseGroup (req, res) {
    const query = req.params.query
    const regex = new RegExp(query, 'i')
    const courses = await Course.find({ courseGroup: { $regex: regex } })
    res.json(courses.map(c => c.courseTitle))
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

    res.json(result)
  }
}
