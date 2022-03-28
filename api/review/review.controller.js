const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
// const socketService = require('../../services/socket.service')
const reviewService = require('./review.service')


async function getReviews(req, res) {
  try {
    const filterBy = req.query
    const reviews = await reviewService.query(filterBy)
    res.send(reviews)
  } catch (err) {
    logger.error('Failed to get reviews', err)
    res.status(500).send({ err: 'Failed to get reviews' })
  }
}

async function addReview(req, res) {
  try {
    const review = req.body
    const addedReview = await reviewService.addReview(review)
    res.send(addedReview)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

async function deleteReview(req, res) {
  try {
    await reviewService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete review', err)
    res.status(500).send({ err: 'Failed to delete review' })
  }
}


module.exports = {
  getReviews,
  deleteReview,
  addReview
}