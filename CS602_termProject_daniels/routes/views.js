const express = require('express');
const router = express.Router();


// Default page
router.get('/', (req, res) => {
    //res.redirect('/employees');
    res.send('Hello World!');
});

module.exports = router;