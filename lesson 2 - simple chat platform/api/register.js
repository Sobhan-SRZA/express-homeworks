const registerHandler = require('../middleware/registerHandler');
const express = require('express');
const router = express.Router();

router.post('/', registerHandler);

module.exports = router;