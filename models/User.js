const {mongoose} = require('./mongoose')

const User = mongoose.model('Users', {
    username: String,
    email: String,
    password: String
})

async function listUsers() {
    return await User.find()
}

async function getIdByUsername(username) {
    try {
        if (!username) {
            throw new Error("Username non fornito")
        }

        const user = await User.findOne({ username })

        return user
    } catch (error) {
        console.error("Errore durante la ricerca dell'utente:", error)
        throw error
    }
}

module.exports = {User, listUsers, getIdByUsername}