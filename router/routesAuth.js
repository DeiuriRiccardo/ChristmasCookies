const express = require('express');
const {validationLogin, validationFields} = require('../middlewars/login')
const logout = require('../middlewars/logout')
const registerUser = require('../middlewars/signup')

const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/../public/auth" })
})

router.get('/signup', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/../public/auth" })
})

router.get("/logout", logout, (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/../public/auth" });
});

router.post('/signupPost', registerUser, (req, res) => {
    res.status(201).send('Utente registrato con successo');
})

router.post('/loginPost', validationFields, validationLogin, (req, res) => {
    res.redirect('/')
});

module.exports = router