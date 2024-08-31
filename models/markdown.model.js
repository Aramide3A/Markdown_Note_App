const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema({
    file_name: String
})

const markdowns = mongoose.model('Markdown',schema)

module.exports = markdowns