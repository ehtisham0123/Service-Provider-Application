let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
let temp = {};

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

router.get("/enrolled/:name?", verifyToken, async function (req, res, next) {
  try {
    if (req.params.name) {
      let sql = `
    SELECT services.*
    FROM services
    WHERE services.name LIKE ? AND services.id IN (SELECT enrollment.service_id 
    FROM enrollment WHERE user_id = ?)`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id], function (err, services) {
        res.status(201).json({ services: services });
      });
    } else {
      sql = `
    SELECT services.*
    FROM services
    WHERE services.id IN
    (SELECT enrollment.service_id
    FROM enrollment
    WHERE
    user_id = ?);
    `;
      await db.query(sql, [req.user_id], function (err, services) {
        res.status(201).json({ services: services });
      });
    }
  } catch (er) {
    console.log(err);
  }
});

// connect to database
db.connect();
/* GET services listing. */
router.get("/:name?", verifyToken, (req, res, next) => {
  const getUser = async () => {
    var sql = `SELECT users.latitude as user_latitude,users.longitude as user_longitude FROM users WHERE users.id = ?`;
     db.query(sql, [req.user_id], function (err, user) {
      user = user[0];
      if (req.params.name) {
        let sql = `SELECT services.*,service_providers.name as service_provider_name
          FROM services
          INNER JOIN service_providers ON services.service_provider_id=service_providers.id 
          WHERE services.name LIKE ?`;
        name = "%" + req.params.name + "%";
        db.query(sql,[name], (err, services) => {
          if (err) throw err;
  
              for(let i=1; i<services.length; i++)
              {
                for(let j=0; j<services.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(services[j].latitude)/180;
                  var theta = parseFloat(user.user_longitude)-parseFloat(services[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  radlat2 = Math.PI * parseFloat(services[j+1].latitude)/180;
                  theta = parseFloat(user.user_longitude)-parseFloat(services[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=services[j];
                    services[j]=services[j+1];
                    services[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: services });
        });
      } else {
        let sql = `SELECT services.*,service_providers.name  as service_provider_name,service_providers.latitude,service_providers.longitude
          FROM services
          INNER JOIN service_providers ON services.service_provider_id=service_providers.id
          WHERE 1
          `;
          db.query(sql, (err, services) => {
          if (err) throw err;
  
              for(let i=1; i<services.length; i++)
              {
                for(let j=0; j<services.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(services[j].latitude)/180;
                  var theta = parseFloat(user.user_longitude)-parseFloat(services[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  radlat2 = Math.PI * parseFloat(services[j+1].latitude)/180;
                  theta = parseFloat(user.user_longitude)-parseFloat(services[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=services[j];
                    services[j]=services[j+1];
                    services[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: services });
        });
      }
    });
  };
  getUser();
});

/* GET single service */
router.get("/show/:id", verifyToken, async (req, res, next) => {
  try {
    let sql = `SELECT services.*,
      service_providers.id as service_provider_id,
      service_providers.firstname as service_provider_firstname,
      service_providers.lastname as service_provider_lastname,
      service_providers.country as service_provider_country,
      service_providers.city as service_provider_city,
      service_providers.avatar as service_provider_photo
      FROM services 
      INNER JOIN service_providers ON services.service_provider_id=service_providers.id
      WHERE
      services.id = ?
      `;
    await db.query(sql, [req.params.id], (err, result) => {
      try {
        sql = `SELECT reviews.*,
        users.firstname as user_firstname,
        users.lastname as user_lastname,
        users.avatar as user_photo
        FROM reviews 
        INNER JOIN users ON reviews.user_id=users.id
        WHERE
        reviews.service_id = ?
      `;
        db.query(sql, [req.params.id], (err, reviews) => {
          try {
            sql = `SELECT enrollment.*
              FROM enrollment
              WHERE
              user_id = ? AND service_id = ?;
              `;
            db.query(
              sql,
              [req.user_id, req.params.id],
              function (err, enrollment) {
                if (enrollment.length > 0) {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: enrollment[0].id,
                  });
                } else {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: 0,
                  });
                }
              }
            );
          } catch (er) {
            console.log(err);
          }
        });
      } catch (er) {
        console.log(err);
      }
    });
  } catch (er) {
    console.log(err);
  }
});

router.delete("/enrollment/:id", verifyToken, async (req, res, next) => {
  let sql = `DELETE FROM enrollment WHERE service_id = ? AND user_id = ?`;
  await db.query(sql, [req.params.id, req.user_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});

router.delete("/reviews/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM reviews WHERE id = ? AND user_id`;
  await db.query(sql, [req.params.id, req.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});

router.post("/enroll", verifyToken, async function (req, res, next) {
  const service_id = req.body.service_id;
  const service_provider_id = req.body.service_provider_id;
  const user_id = req.user_id;
  sql =
    "INSERT INTO `enrollment` (user_id, service_id,service_provider_id) VALUES (?)";
  let values = [user_id, service_id, service_provider_id];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ enrollment_id: result.insertId });
    }
  });
});

router.post("/review", verifyToken, async function (req, res, next) {
  const user_id = req.user_id;
  const service_id = req.body.service_id;
  const service_provider_id = req.body.service_provider_id;
  const enorllment_id = req.body.enorllment_id;
  const reviews = req.body.reviews;
  const reviews_details = req.body.reviews_details;

  sql =
    "INSERT INTO `reviews` (user_id, service_id,service_provider_id,enrollment_id,reviews,reviews_details) VALUES (?)";
  let values = [
    user_id,
    service_id,
    service_provider_id,
    enorllment_id,
    reviews,
    reviews_details,
  ];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
      res.status(201).json({ error: "Error while inseting data" });
    } else {
      res.status(201).json({ success: "Review Added" });
    }
  });
});

/* GET users listing. */

module.exports = router;
