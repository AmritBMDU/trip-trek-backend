const express = require('express');
const { addPackage, getPackage } = require('../controllers/package.controller');
const { uploadSingle } = require('../middlewares/cloudinary.middleware');
const router = express.Router();

router.post('/add-package', uploadSingle("image"), (req, res) => {
    addPackage(req, res);
});

router.get('/get-package', (req, res) => {
    getPackage(req, res)
})

module.exports = router;