const express = require('express');
const router = express.Router();

var login_controller = require('../../Controllers/admin/admin.js');

router.post('/login', login_controller.login );

module.exports = router;
