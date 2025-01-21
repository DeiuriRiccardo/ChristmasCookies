const {mongoose} = require('./mongoose')

const Taste = mongoose.model('Tastes', {
    name: String
})

async function listTastes() {
    return await Taste.find()
}

async function getTasteById(taste_id){
    return await Taste.findById(taste_id)
}

module.exports = {Taste, listTastes, getTasteById}