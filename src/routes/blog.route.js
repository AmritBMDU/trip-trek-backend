const express = require('express');
const { uploadAny } = require('../middlewares/cloudinary.middleware');
const { addBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog } = require('../controllers/blog.controller');
const router = express.Router();

router.post('/add-blog', uploadAny(), (req, res) => {
    addBlog(req, res);
});

router.get('/get-all-blogs', (req, res) => {
    getAllBlogs(req, res)
});

router.get('/get-by-id-blog/:id', (req, res) => {
    getBlogById(req,res);
});

router.put('/put-blog/:id', uploadAny(), (req, res) => {
    updateBlog(req, res);
});

router.delete('/delete-blog/:id',(req,res)=>{
    deleteBlog(req,res)
});

module.exports = router;
