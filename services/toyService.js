const fs = require("fs");

// CRUDL : CREATE, READ, UPDATE, DELETE, LIST

const gToys = require("../data/toy.json");

// const PAGE_SIZE = 3;

function query(filterBy) {
  var toys = gToys;
  if (!toys) return Promise.reject("no toys");

  //   const regex = new RegExp(filterBy.txt, "i");
  //   var cars = gToys.filter((car) => regex.test(car.vendor));

  //   if (filterBy.page) {
  //     startIdx = filterBy.page * PAGE_SIZE;
  //     cars = cars.slice(startIdx, startIdx + PAGE_SIZE);
  //   }
  return Promise.resolve(toys);
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId);
  if (!toy) return Promise.reject("No Such Toy");
  const reviews = ["Good Toy!", "Expensive", "unbreakable!"];
  toy.reviews = reviews[_getRandomIntInclusive(0, 2)];
  const idx = gToys.findIndex((currToy) => currToy._id === toy._id);
  gToys.splice(idx, 1, toy);
  _saveToysToFile();
  return Promise.resolve(toy);
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId);
  if (idx === -1) return Promise.reject("No such toy");
  gToys.splice(idx, 1);
  return _saveToysToFile();
}

function save(toy) {
  if (toy._id) {
    const idx = gToys.findIndex((currToy) => currToy._id === toy._id);
    if (idx === -1) return Promise.reject("No such toy");
    gToys[idx] = toy;
  } else {
    // CREATE
    toy._id = _makeId();
    gToys.unshift(toy);
  }
  return _saveToysToFile().then(() => toy);
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile("data/toy.json", JSON.stringify(gToys, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function _makeId(length = 5) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

module.exports = {
  query,
  getById,
  remove,
  save,
};

function _getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
