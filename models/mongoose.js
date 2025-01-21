const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const url = process.env.DB_DIALECT + '://' + process.env.DB_HOST + ':27017/' + process.env.DB_NAME

mongoose.pluralize(null)
mongoose.set('strictQuery')
mongoose.connect(url)

function verifyId(id){
    return mongoose.Types.ObjectId.isValid(id)
}

module.exports = {mongoose, verifyId}