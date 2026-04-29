const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res
        .status(404)
        .type("application/problem+json")
        .json({
            code: 404,
            message: "Endpoint not founded."
        });
});

module.exports = router;