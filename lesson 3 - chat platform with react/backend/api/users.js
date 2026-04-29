const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authHandler');

router.get('/me', authenticateToken, (req, res) => {
    const userProfile = {
        id: req.user.id,
        username: req.user.username,
        created_at: req.user.created_at,
    };

    return res
        .status(200)
        .type("application/json")
        .json({
            code: 200,
            message: "User is onlinned!",
            user: userProfile
        });
});

module.exports = router;