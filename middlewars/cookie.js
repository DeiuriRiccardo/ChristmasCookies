const { verifyId } = require('../models/mongoose')
const { Cookie, getCookieById } = require('../models/Cookie')

const validateCookieData = (req, res, next) => {
    const { name, taste } = req.body
    if (!name || !taste || !verifyId(taste)) {
        return res.status(400).send("Inserire un valore valido nei campi.")
    }
    next()
};

const checkCookieOwnership = async (req, res, next) => {
    try {
        const { id } = req.params
        const cookie = await Cookie.findOne({ _id: id, author: req.session.username })

        if (!cookie) {
            return res.status(404).send("Biscotto non trovato.")
        }
        
        req.ownCookie = cookie
        next()
    } catch (error) {
        res.status(500).send("Errore interno del server.")
    }
};

module.exports = { validateCookieData, checkCookieOwnership }