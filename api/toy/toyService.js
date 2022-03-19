const dbService = require("../../services/dbService.js");
const logger = require("../../services/loggerService.js");
const ObjectId = require("mongodb").ObjectId;

async function query(filterBy) {
  try {
    const criteria = {};

    const collection = await dbService.getCollection("Toy");
    var toys = await collection.find(criteria).toArray();
    return toys;
  } catch (err) {
    logger.error("cannot find toys", err);
    throw err;
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection("Toy");
    const toy = collection.findOne({ _id: ObjectId(toyId) });
    return toy;
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err);
    throw err;
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection("Toy");
    const res = await collection.deleteOne({ _id: ObjectId(toyId) });
    console.log(toyId);
    return toyId;
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err);
    throw err;
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection("Toy");
    const addedToy = await collection.insertOne(toy);
    return addedToy;
  } catch (err) {
    logger.error("cannot insert toy", err);
    throw err;
  }
}
async function update(toy) {
  try {
    var id = ObjectId(toy._id);
    delete toy._id;
    const collection = await dbService.getCollection("Toy");
    await collection.updateOne({ _id: id }, { $set: { ...toy } });
    return toy;
  } catch (err) {
    logger.error(`cannot update toy ${toyId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
