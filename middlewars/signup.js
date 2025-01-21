const bcrypt = require('bcrypt')
const {User} = require('../models/User')
const dotenv = require('dotenv').config()

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] })
        if (existingUser) {
            return res.status(400).send('Email o username già in uso')
        }
        bcrypt.hash(password, process.env.SALT, async (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Errore nella crittografia della password')
            }

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword
            })

            try {
                const savedUser = await user.save();
                next();
            } catch (saveError) {
                res.status(500).send('Errore durante la registrazione dell\'utente')
            }
        });
    } catch (error) {
        res.status(500).send('Errore interno del server')
    }
};

module.exports = registerUser
