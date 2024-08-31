const express = require("express");
const multer = require("multer");
const markdowns = require('../models/markdown.model')
const router = express()
const fs= require('fs');
const  markdownIt = require("markdown-it");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now() + '.md')
    }
})
const upload = multer({ storage: storage })


router.post('/upload', upload.single('file'), async(req,res)=>{
    try {
        const markdownFile = req.file.filename
        const newMarkdown = await markdowns.create({
            file_name : markdownFile
        })
        console.log(newMarkdown)
        res.status(200).send('New Markdowm Created Successfully')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/markdown', async(req,res)=>{
    try {
        const allMarkdown = await markdowns.find({})
        res.status(200).send(allMarkdown)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/markdown/:id', async(req,res)=>{
    try {
        const markdownDoc = await markdowns.findById(req.params.id);
        if (!markdownDoc) {
            return res.status(404).send('Markdown not found');
        }
        
        fs.readFile(`public/${markdownDoc.file_name}`,'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('File not found:', err.path);
                    return res.status(404).send('File not found');
                } else {
                    console.error('Error reading file:', err);
                    return res.status(500).send('Error reading file');
                }
            }
            const md = markdownIt()
            const result = md.render(data)
            res.status(200).send(result)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router