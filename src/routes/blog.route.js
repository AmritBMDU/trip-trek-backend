const express = require('express');
const { uploadSingle } = require('../middlewares/cloudinary.middleware');
const { addBlog, getAllBlogs, getBlogById, deleteBlog } = require('../controllers/blog.controller');
const router = express.Router();

router.post('/add-blog', uploadSingle("image"), (req, res) => {
    addBlog(req, res);
});

router.get('/get-all-blogs', (req, res) => {
    getAllBlogs(req, res)
});

router.get('/get-by-id-blog/:id', (req, res) => {
    getBlogById(req,res);
});

router.delete('/delete-blog/:id',(req,res)=>{
    deleteBlog(req,res)
});

module.exports = router;