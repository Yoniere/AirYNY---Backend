const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
  // console.log('filterBy', filterBy);
  try {
    const collection = await dbService.getCollection('review')

    const reviews = await collection
      .aggregate([
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'userId',
            as: 'byUser',
          },
        },
        { $unwind: '$user' }, // [{.....}] ==> {.....}
        {
          $lookup: {
            from: 'stay',
            foreignField: '_id',
            localField: 'stayId',
            as: 'byStay',
          },
        },
        { $unwind: '$stay' }, // [{.....}] ==> {.....}
        // {
        // $project: {
        //   _id: 1,
        //   by: '',
        //   txt: 1,
        //   user: { _id: 1, fullname: 1 },
        //   stay: { _id: 1, fullname: 1, imgUrl: 1,txt },
        // },

      ])
      .toArray()
    reviews = reviews.map(review => {
      review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
      review.byStay = { _id: review.byStay._id, name: review.byStay.name }
      delete review.userId
      delete review.stayId
      return review
    })
    return reviews
  } catch (err) {
    logger.error('cannot find reviews', err)
    throw err
  }

}




async function remove(reviewId) {
  try {
    const collection = await dbService.getCollection('review')
    // const criteria = { _id: ObjectId(reviewId) }
    await collection.deleteOne()
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}


async function addReview(review) {
  try {
    const reviewToAdd = {
      userId: ObjectId(review.userId),
      stayId: ObjectId(review.stayId),
      by: review.by,
      txt: review.txt,
    }

    const collection = await dbService.getCollection('review')
    const addedReview = await collection.insertOne(reviewToAdd)

    reviewToAdd._id = addedReview.insertedId
    return reviewToAdd
  } catch (err) {
    logger.error('cannot insert review', err)
    throw err
  }
}

// function _buildCriteria(filterBy) {
//   const criteria = {}
//   if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
//   if (filterBy.stayId) criteria.stayId = ObjectId(filterBy.stayId)
//   return criteria
// }

module.exports = {
  query,
  remove,
  addReview
}





// async function query(filterBy = {}) {
//     try {
//         const criteria = _buildCriteria(filterBy)
//         const collection = await dbService.getCollection('review')
//         // const reviews = await collection.find(criteria).toArray()
//         var reviews = await collection.aggregate([
//             {
//                 $match: criteria
//             },
//             {
//                 $lookup:
//                 {
//                     localField: 'byUserId',
//                     from: 'user',
//                     foreignField: '_id',
//                     as: 'byUser'
//                 }
//             },
//             {
//                 $unwind: '$byUser'
//             },
//             {
//                 $lookup:
//                 {
//                     localField: 'aboutUserId',
//                     from: 'stay',
//                     foreignField: '_id',
//                     as: 'stay'
//                 }
//             },
//             {
//                 $unwind: '$aboutUser'
//             }
//         ]).toArray()
//         reviews = reviews.map(review => {
//             review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
//             review.stay = { _id: review.stay._id, name: review.stay.name }
//             console.log('review.stay',review.stay);
//             delete review.byUserId
//             delete review.stayId
//             return review
//         })
//         return reviews
//     } catch (err) {
//         logger.error('cannot find reviews', err)
//         throw err
//     }
//     console.log('reviews',reviews);

// }
