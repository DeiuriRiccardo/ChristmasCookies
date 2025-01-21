const bcrypt = require('bcrypt')
const {User} = require('../models/User')

function validationLogin(req, res, next) {
    const { username, password } = req.body

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.status(400).send("Username errato.")
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).send("Errore del server.")
                }
                if (!isMatch) {
                    return res.status(400).send("Username e/o password sono errati.")
                }

                req.session.loggedin = true;
                req.session.username = username;
                next();
            });
        })
        .catch(err => {
            res.status(500).send("Errore del server.")
        })
}

function validationFields(req, res, next){
    const {username, password} = req.body;
    if(!username || !password){
        return res.send("Username e password sono obbligatori.");
    }
    next();
}

module.exports = {validationLogin, validationFields}