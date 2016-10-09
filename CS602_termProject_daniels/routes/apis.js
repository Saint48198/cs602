const express = require('express');
const router = express.Router();

const user = require('../controllers/user');
const session =  require('../controllers/session');


// Default page
router.get('/', (req, res) => {
    //res.redirect('/employees');
    res.send('Hello World!');
});

// api add user
router.post('/user', user.addUser);

// api authenticate  user login
router.post('/auth', user.auth);

// api for getting session status
router.get('/session', session.status);

module.exports = router;