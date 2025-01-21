const express = require('express');
const { OwnListCookie, listFavorites } = require('../models/OwnListCookie');
const {listCookies, getCookieById} = require('../models/Cookie')
const {getIdByUsername} = require('../models/User')
const {getTasteById} = require('../models/Taste')

const router = express.Router();

// @TODO refactoring (dividere in middlewares)

router.get('/', async (req, res) => {
    if(req.session.username){
        const user = await getIdByUsername(req.session.username)
        if (!user) {
            return res.status(404).send("Utente non trovato.")
        }

        // lista dei biscotti creati
        const listOwnCookies = await listCookies(req.session.username);
        for (const cookie of listOwnCookies) {
            const taste = await getTasteById(cookie.taste);
            cookie.taste = taste.name; 
        }
        
        // lista dei biscotti nei preferiti
        const listFav = await listFavorites(user.id)
        const promises = listFav.map(async (element) => {
            const cookie = await getCookieById(element.cookie_id);
            const taste = await getTasteById(cookie.taste);
            cookie.taste = taste.name;
            return cookie;
        });

        Promise.all(promises).then((listCookies) => {
            res.render('favorites', { cookies: listCookies, user: req.session.username, ownCookies: listOwnCookies });
        }).catch((err) => {
            res.status(500).send('Errore interno del server');
        });
    }else{
        res.send("Sessione scaduta.")
    }
})

router.get('/addFav/:id', async (req, res) => {
    const cookie_id = req.params['id']
    if(req.session.username){
        const user = await getIdByUsername(req.session.username)
        if (!user) {
            return res.status(404).send("Utente non trovato.")
        }

        const alreadyExists = await OwnListCookie.findOne({
            user_id: user.id,
            cookie_id: cookie_id
        })
        if(alreadyExists){
            return res.status(404).send("Il biscotto è già nella lista.")
        }

        const newElementList = new OwnListCookie({
            user_id: user.id,
            cookie_id: cookie_id
        })

        const elementSaved = await newElementList.save()
        if(!elementSaved){
            return res.status(404).send("Errore durante il salvataggio del biscotto nella lista preferiti.")
        }
        console.log("Biscotto aggiunto alla lista Preferiti", elementSaved.cookie_id)

        res.redirect('/favorites')
    }else{
        res.send("Sessione scaduta.")
    }
})

router.get('/removeFav/:id', async (req, res) => {
    const cookie_id = req.params['id']
    if(req.session.username){
        const user = await getIdByUsername(req.session.username)
        if (!user) {
            return res.status(404).send("Utente non trovato.")
        }

        const objToRemove = await OwnListCookie.findOneAndDelete({
            user_id: user.id,
            cookie_id: cookie_id
        })

        if (!objToRemove) {
            return res.status(404).send("Elemento non trovato nella lista preferiti.")
        }
        res.redirect('/favorites/')
    }else{
        res.send("Sessione scaduta.")
    }
})

module.exports = router