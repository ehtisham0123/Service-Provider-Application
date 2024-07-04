const express = require('express');
const verifyToken = require('../verifyToken');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

// connect to database
db.connect();

// Login
exports.login = async (req, res) => {

    let email = req.body.email;
    let password  = req.body.password;
   	var sql = 'SELECT * FROM admin WHERE email = ? ';
        await db.query(sql, [email], function (err, user) {
		user = user[0];
		if (user) {
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				res.status(201).json({'error':'invalid credentials'});
			}
			else{
				var token = jwt.sign({ id: user.id,email:user.email,role:'admin' }, 'Ehtisham');
				res.status(201).json({'user_id':user.id, 'user_name':user.name,'user_role':'admin','token':token});
			}
		}else{
			res.status(201).json({'error':'invalid credentials'});
		}
    
	});

};

