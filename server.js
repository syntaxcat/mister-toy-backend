// import { toyService } from "./services/toyService.js";

const toyService = require("./services/toyService.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => res.send("Hello!"));

// Toy LIST
app.get("/api/toy", (req, res) => {
  console.log("Backend getting your Toys");
  //   const filterBy = {
  //     txt: req.query.txt || "",
  //     page: req.query.page || 0,
  //   };
  toyService
    .query()
    .then((toys) => {
      res.send(toys);
    })
    .catch((err) => {
      console.log("Backend had error: ", err);
      res.status(404).send("No Toys");
    });
});

// Toy READ
app.get("/api/toy/:toyId", (req, res) => {
  console.log("Backend getting your Toy:", req.params.toyId);
  toyService
    .getById(req.params.toyId)
    .then((toy) => {
      res.send(toy);
    })
    .catch((err) => {
      console.log("Backend had error: ", err);
      res.status(404).send("No such Toy");
    });
});

// Toy DELETE
app.delete("/api/toy/:toyId", (req, res) => {
  console.log("Backend removing Toy:", req.params.toyId);
  toyService
    .remove(req.params.toyId)
    .then(() => {
      res.send({ msg: "Removed" });
    })
    .catch((err) => {
      console.log("Backend had error: ", err);
      res.status(404).send("Cannot remove Toy");
    });
});

// Toy CREATE
app.post("/api/toy", (req, res) => {
  const { name, price, type, createdAt, inStock, labels } = req.body;
  const toy = {
    _id: "",
    name,
    price,
    type,
    createdAt,
    inStock,
    labels,
  };
  console.log("toy", toy);

  toyService
    .save(toy)
    .then((savedToy) => {
      res.status(201).send(savedToy);
    })
    .catch((err) => {
      console.log("Backend had error: ", err);
      res.status(401).send("Cannot create Toy");
    });
});

// Toy UPDATE
app.put("/api/toy/:toyId", (req, res) => {
  console.log("Backend Saving Toy:");
  const { _id, name, price, type, createdAt, inStock, labels } = req.body;
  const toy = {
    _id,
    name,
    price,
    type,
    createdAt,
    inStock,
    labels,
  };

  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy);
    })
    .catch((err) => {
      console.log("Backend had error: ", err);
      res.status(401).send("Cannot update Toy");
    });
});

app.listen(3030, () => console.log("Server listening on port 3030"));
