var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const fileUpload = require("express-fileupload");
const fs = require("fs");
router.use(fileUpload());

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

// connect to database
db.connect();


/* GET service_providers listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT service_providers.* FROM service_providers WHERE service_providers.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `SELECT services.id,services.name
          FROM services 
          INNER JOIN service_providers ON services.service_provider_id=service_providers.id
          WHERE
          service_providers.id = ?
          `;
             await db.query(sql, [req.params.id], function (err, services) {
                  res.status(201).json({ result: result , services : services });
              });
        }catch (er) {
            console.log(err);
        }
        })();

      });
      } catch (er) {
      console.log(err);
    }

});

 

module.exports = router;
