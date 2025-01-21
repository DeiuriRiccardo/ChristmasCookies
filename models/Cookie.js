const {mongoose} = require('./mongoose')

const Cookie = mongoose.model('Cookies', {
    name: String,
    taste: String,
    author: String
})

async function listCookies(author) {
    if(author){
        return await Cookie.find({author: author})
    }
    return await Cookie.find()
}

async function getCookieById(cookie_id) {
    return await Cookie.findById(cookie_id)
}

module.exports = {Cookie, listCookies, getCookieById}