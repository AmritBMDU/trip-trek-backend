const BlogModel = require("../models/Blog.model");
const { uploadToCloudinary } = require("../middlewares/cloudinary.middleware");

const addBlog = async (req, res) => {
    try {
        // Step 1: Handle main image upload
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
            } catch (error) {
                console.error("Main image upload error:", error.message);
                return res.status(500).json({ success: false, message: "Main image upload failed" });
            }
        }
        // Step 2: Extract data
        let { image, title, content, headingSection } = req.body;
        if (!image || !title || !content) {
            return res.status(400).json({ success: false, message: "Image, title, and content are required." });
        }
        // Step 3: Parse headingSection
        if (typeof headingSection === 'string') {
            try {
                headingSection = JSON.parse(headingSection);
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid headingSection JSON." });
            }
        }
        // Step 4: Upload base64 headingImages if needed
        const processedHeadings = await Promise.all(
            (headingSection || []).map(async (item, idx) => {
                let img = item.headingImage;
                if (img && img.startsWith('data:')) {
                    try {
                        const uploaded = await uploadToCloudinary(img, `blog/headings/${idx}`);
                        img = uploaded?.secure_url || img;
                    } catch (err) {
                        console.error(`Heading image ${idx} upload failed:`, err.message);
                        img = ""; // optional: or keep original base64
                    }
                }
                return {
                    heading: item.heading,
                    headingParagraph: item.headingParagraph,
                    headingImage: img,
                };
            })
        );
        // Step 5: Save blog
        const blog = new BlogModel({
            image,
            title,
            content,
            headingSection: processedHeadings,
        });
        await blog.save();
        res.status(201).json({ success: true, message: "Blog added successfully.", blog });

    } catch (err) {
        console.error("Add Blog Error:", err.message);
        res.status(500).json({ success: false, message: "Something went wrong while adding the blog." });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogData = await BlogModel.find({});
        return res.status(200).json({ success: true, data: blogData });
    } catch (error) {
        console.error("Error in getAllBlogs function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getBlogById = async (req, res) => {
    try {
        const id = req.params.id;
        const blogData = await BlogModel.findById(id);
        return res.status(200).json({ success: true, data: blogData });
    } catch (error) {
        console.error("Error in getBlogById function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ success: false, message: "Id not found!" });
        await BlogModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Package Deleted successfully" })
    } catch (error) {
        console.error("Error in updatePackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
module.exports = {
    addBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
};
