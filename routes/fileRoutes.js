const express = require('express');
const multer = require('multer');
const File = require('../models/fileModel');
const generateCode = require('../utils/generateCode');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const code = generateCode();
        const newFile = new File({
            filename: req.file.filename,
            originalname: req.file.originalname,
            code,
            size:req.file.size
        });
        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', code });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload file', error });
    }
});


router.get('/download/:code', async (req, res) => {
    try {
        const file = await File.findOne({ code: req.params.code });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.download(`uploads/${file.filename}`, file.originalname);
    } catch (error) {
        res.status(500).json({ message: 'Failed to download file', error });
    }
});

router.get('/get-total-count',async(req,res)=>{
    try {
        const count=await File.countDocuments();
        
        res.json({count});
       
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

router.get('/get-total-size',async(req,res)=>{
    try {
        const files=await File.find({});
        let size=0;
        for (let el of files){
            if(el.size){
                size+=el.size;
            }
        }

       res.json({size})
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

module.exports = router;
