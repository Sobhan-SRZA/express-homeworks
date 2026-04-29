const express = require('express');
const loginHandler = require('../middleware/loginHandler');
const router = express.Router();

router.post('/', loginHandler);

module.exports = router;