const express = require('express');
const router = express.Router();

const user = require('../controllers/user');


// Default page
router.get('/', (req, res) => {
    //res.redirect('/employees');
    res.send('Hello World!');
});

// api add user
router.post('/user', user.addUser);

// api authenticate  user login
router.post('/auth', user.auth);

module.exports = router;