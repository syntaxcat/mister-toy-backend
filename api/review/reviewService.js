const dbService = require("../../services/dbService");
const ObjectId = require("mongodb").ObjectId;
const asyncLocalStorage = require("../../services/alsService");

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    console.log(filterBy);
    const collection = await dbService.getCollection("Review");
    // const reviews = await collection.find(criteria).toArray()
    var reviews = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            localField: "byUserId",
            from: "User",
            foreignField: "_id",
            as: "byUser",
          },
        },
        {
          $unwind: "$byUser",
        },
        {
          $lookup: {
            localField: "aboutToyId",
            from: "Toy",
            foreignField: "_id",
            as: "aboutToy",
          },
        },
        {
          $unwind: "$aboutToy",
        },
      ])
      .toArray();
    reviews = reviews.map((review) => {
      review.byUser = {
        _id: review.byUser._id,
        fullname: review.byUser.fullname,
      };
      // review.aboutToy = {
      //   _id: review.aboutToy._id,
      //   content: review.aboutToy.content,
      // };
      delete review.byUserId;
      // delete review.aboutToyId;
      return review;
    });

    return reviews;
  } catch (err) {
    logger.error("cannot find reviews", err);
    throw err;
  }
}

async function remove(reviewId) {
  try {
    const store = asyncLocalStorage.getStore();
    const { userId, isAdmin } = store;
    const collection = await dbService.getCollection("Review");
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(reviewId) };
    if (!isAdmin) criteria.byUserId = ObjectId(userId);
    await collection.deleteOne(criteria);
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err);
    throw err;
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      byUserId: ObjectId(review.byUserId),
      aboutToyId: ObjectId(review.aboutToyId),
      content: review.content,
    };
    const collection = await dbService.getCollection("Review");
    await collection.insertOne(reviewToAdd);
    return reviewToAdd;
  } catch (err) {
    logger.error("cannot insert review", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId;
  if (filterBy.aboutToyId) criteria.aboutToyId = filterBy.aboutToyId;
  return criteria;
}

module.exports = {
  query,
  remove,
  add,
};
