const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const markdownRouter = require('./routes/markdown.routes')


app.use(express.json())
app.use('/api', markdownRouter)


app.listen(3000)

mongoose.connect('mongodb://localhost:27017/markdown')