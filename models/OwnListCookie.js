const {mongoose} = require('./mongoose')

const OwnListCookie = mongoose.model('OwnListCookies', {
    user_id: String,
    cookie_id: String
})

async function listFavorites(user_id) {
    return await OwnListCookie.find({
        user_id: user_id
    })
}

module.exports = {OwnListCookie, listFavorites}