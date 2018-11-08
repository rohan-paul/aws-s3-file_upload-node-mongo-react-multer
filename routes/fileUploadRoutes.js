// 'use strict'
require("dotenv").config();
const express = require("express");
const router = express.Router();
const DOCUMENT = require("../models/Document");
const multer = require("multer");
var uploadDocuments = require("./uploadDocuments");
const path = require("path");
const fs = require("fs");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Get all Documents s Routes
router.route("/").get((req, res, next) => {
  DOCUMENT.find(
    {},
    null,
    {
      sort: { createdAt: 1 }
    },
    (err, docs) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(docs);
    }
  );
});

// Route to get a single existing GO data (needed for the Edit functionality)
router.route("/:id").get((req, res, next) => {
  DOCUMENT.findById(req.params.id, (err, document) => {
    if (err) {
      return next(err);
    }
    res.json(document);
  });
});

// route to upload a pdf document file
router.post("/upload", function(req, res) {
  uploadDocuments(req, res, error => {
    if (error) {
      console.log("Ooops some error happened, please try again !!");
    } else {
      if (req.file == undefined) {
        console.log("Ooops some error happened, no file was selected");
      } else {
        var fullPath = req.file.filename;
        var document = {
          path: fullPath,
          description: req.body.description
        };
        var newDocument = new DOCUMENT(document);
        newDocument.save(function(error, newGo) {
          if (error) {
            throw error;
          }
          res.status(200).send(newGo);
        });
      }
    }
  });
});

// Route to edit existing record's description field
// Here, I am updating only the description in this mongo record. Hence using the "$set" parameter
router.route("/edit/:id").put((req, res, next) => {
  DOCUMENT.findByIdAndUpdate(
    req.params.id,
    { $set: { description: Object.keys(req.body)[0] } },
    { new: true },
    (err, updateDoc) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(updateDoc);
    }
  );
});

// Router to delete a DOCUMENT file
router.route("/:id").delete((req, res, next) => {
  DOCUMENT.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
      return next(err);
    }
    // Now delete the file from the disk storage
    var target_path = "./uploads/" + result.path;
    fs.unlink(target_path, function() {
      res.send({
        status: "200",
        responseType: "string",
        response: "success"
      });
    });
  });
});

module.exports = router;
