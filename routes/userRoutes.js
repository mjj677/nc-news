const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user-controllers/users-controllers.js');

router.get('/', getUsers);

module.exports = router;