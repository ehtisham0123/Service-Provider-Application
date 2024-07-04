let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require('../verifyToken');

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

// connect to database
db.connect();



router.get("/hired-services/:id",verifyToken,async (req, res, next) => {
   
  try{
    sql = `SELECT users.id,users.firstname, users.lastname,users.email,users.avatar
      FROM users
      WHERE users.id IN
      (SELECT enrollment.user_id
      FROM enrollment
      WHERE
      service_id = ?) 
  `;
      db.query(sql, [req.params.id], function (err, result) {           
          res.status(201).json({ result:result});
      });
    }catch (er) {
      console.log(err);
    }
}); 



/* GET services listing. */
router.get("/:name?",verifyToken, async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT services.*
    FROM services
    WHERE services.name LIKE ? AND services.service_provider_id = ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name,req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT services.*
    FROM services
    WHERE services.service_provider_id = ?
    `;
    await db.query(sql,[req.user_id],function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});

router.post("/create",verifyToken, async (req, res, next) => {
  let name = req.body.name;
  let details = req.body.details;  
  sql =
    "INSERT INTO `services` (name, details,service_provider_id) VALUES (?)";
    let values = [name, details,req.user_id];
    await db.query(sql, [values], function (err, result) {
        if (err){
          console.log(err)
          res.status(201).json({'error':'Error while inseting data'});
        }
        else{        
          res.status(201).json({'success':'Service Added'});
        }  
    })
  })

/* GET single service */
router.get("/show/:id",verifyToken, async function (req, res, next) {
    try{
      let sql = `SELECT services.*
      FROM services 
      INNER JOIN service_providers ON services.service_provider_id=service_providers.id
      WHERE
      services.id = ?
      `;
      await db.query(sql, [req.params.id], function (err, result) {
      try{
      sql = `SELECT reviews.*,
      users.firstname as user_firstname,
      users.lastname as user_lastname,
      users.avatar as user_photo
      FROM reviews 
      INNER JOIN users ON reviews.user_id=users.id
      WHERE
      reviews.service_id = ?
      `;
          db.query(sql, [req.params.id], function (err, reviews) {
               res.status(201).json({ result: result , reviews : reviews});  
          });
        }catch (er) {
          console.log(err);
        }
      }); 
    }catch (er) {
      console.log(err);
    }
});


/* GET single service */
router.get("/edit/:id",verifyToken, async function (req, res, next) {
    let sql = `SELECT services.* FROM services
    WHERE
    services.id = ?
    `;
    await db.query(sql, [req.params.id], function (err, result) {
      res.status(201).json({ result: result });
    });
});


router.delete("/:id",verifyToken, async function (req, res, next) {
    let sql = `DELETE FROM services WHERE id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});


router.delete("/enrollment/service/:service_id/user/:user_id",verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM enrollment WHERE service_id = ? AND user_id = ?`;
  await db.query(sql, [req.params.service_id, req.params.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});



// router.delete("/enrollment/:id", verifyToken, async function (req, res, next) {
//   let sql = `DELETE FROM enrollment WHERE service_id = ? AND service_provider_id = ?`;
//   await db.query(sql, [req.params.id, req.user_id], function (err, result) {
//     if (err) throw err;
//     res.status(201).json({ result: result });
//   });
// });



router.put("/update/",verifyToken, async (req, res, next) => {
  let id = req.body.id;
  let name = req.body.name;
  let details = req.body.details;
  let service_provider_id = req.body.service_provider_id;
  sql =
    `
      UPDATE services
      SET name = ?, 
      details = ?,
      service_provider_id = ?
      WHERE id = ? 
      `;    
    await db.query(sql, [name,details,service_provider_id,id], function (err, result) {
        if (err) throw err;      
        res.status(201).json({'success':'Service updated'});  
    })
  })

 
module.exports = router;