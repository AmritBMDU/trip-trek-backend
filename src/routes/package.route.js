const express = require('express');
const { addPackage, getPackage, putPackage, deletePackage } = require('../controllers/package.controller');
const { uploadSingle } = require('../middlewares/cloudinary.middleware');
const PackageModel = require('../models/Package.model');
const router = express.Router();

router.post('/add-package', uploadSingle("image"), (req, res) => {
    addPackage(req, res);
});

router.get('/get-package', (req, res) => {
    getPackage(req, res)
});

router.put('/put-package/:id',uploadSingle("image"),(req,res)=>{
    putPackage(req,res)
});

router.delete('/delete-package/:id',(req,res)=>{
    deletePackage(req,res)
});

router.delete('/delete-all-package',async (req,res)=>{
    try {
        await PackageModel.deleteMany({})
        console.log("delete all");
    } catch (error) {
        console.log("error hai",error);
    }
})

module.exports = router;