const express = require('express');
const { listTastes, getTasteById } = require('../models/Taste');
const { Cookie, getCookieById } = require('../models/Cookie');

const auth = require('../middlewars/auth');
const { validateCookieData, checkCookieOwnership } = require('../middlewars/cookie');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const tastes = await listTastes();
        res.render('create', { tastes });
    } catch (error) {
        res.status(500).send("Errore interno del server.");
    }
});

router.post('/cookie', auth, validateCookieData, async (req, res) => {
    const { name, taste } = req.body;

    try {
        const alreadyExists = await Cookie.findOne({ name: name, author: req.session.username });

        if (alreadyExists) {
            return res.status(400).send(`Hai già creato un biscotto così -> ${alreadyExists.name}.`);
        }

        const newCookie = new Cookie({ name: name, taste: taste, author: req.session.username });
        const savedCookie = await newCookie.save();

        if (!savedCookie) {
            return res.status(400).send("Errore durante il salvataggio del biscotto.");
        }

        res.redirect('/favorites');
    } catch (error) {
        res.status(500).send("Errore nel server.");
    }
});

router.get('/update/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const cookie = await getCookieById(id);

        if (!cookie) {
            return res.status(404).send("Il biscotto non esiste.");
        }

        const tastes = await listTastes();
        const taste = await getTasteById(cookie.taste);
        cookie.taste = taste.name;

        res.render('create', { tastes: tastes, cookie: cookie });
    } catch (error) {
        res.status(500).send("Errore interno del server.");
    }
});

router.post('/cookie/:id', auth, validateCookieData, checkCookieOwnership, async (req, res) => {
    const { name, taste } = req.body;
    const cookieToUpdate = req.ownCookie;

    try {
        cookieToUpdate.name = name;
        cookieToUpdate.taste = taste;

        await cookieToUpdate.save();
        res.redirect('/favorites');
    } catch (error) {
        res.status(500).send("Errore interno del server.");
    }
});

router.get('/delete/:id', auth, checkCookieOwnership, async (req, res) => {
    const cookieToDelete = req.ownCookie;

    try {
        await cookieToDelete.deleteOne();
        res.redirect('/favorites');
    } catch (error) {
        res.status(500).send("Errore interno del server.");
    }
});

module.exports = router;