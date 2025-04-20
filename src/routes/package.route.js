const express = require('express');
const { addPackage, getPackage, putPackage, deletePackage, getPackageById } = require('../controllers/package.controller');
const { uploadSingle } = require('../middlewares/cloudinary.middleware');
const router = express.Router();

router.post('/add-package', uploadSingle("image"), (req, res) => {
    addPackage(req, res);
});

router.get('/get-package', (req, res) => {
    getPackage(req, res)
});

router.get('/get-by-id-package/:id', (req, res) => {
    getPackageById(req,res);
});

router.put('/put-package/:id',uploadSingle("image"),(req,res)=>{
    putPackage(req,res)
});

router.delete('/delete-package/:id',(req,res)=>{
    deletePackage(req,res)
});

module.exports = router;
