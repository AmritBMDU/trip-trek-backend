const BlogModel = require("../models/Blog.model");
const { uploadToCloudinary } = require("../middlewares/cloudinary.middleware");

const addBlog = async (req, res) => {
    try {
        // Step 1: Convert uploaded files into an easy-access map
        const filesMap = {};
        if (Array.isArray(req.files)) {
            req.files.forEach((file) => {
                filesMap[file.fieldname] = file;
            });
        }

        // Step 2: Upload main image
        let mainImageUrl = "";
        if (filesMap["image"]) {
            try {
                const result = await uploadToCloudinary(filesMap["image"]);
                mainImageUrl = result.secure_url;
            } catch (error) {
                console.error("Main image upload error:", error.message);
                return res.status(500).json({ success: false, message: "Main image upload failed" });
            }
        }

        // Step 3: Extract and validate basic fields
        const { title, content } = req.body;
        if (!mainImageUrl || !title || !content) {
            return res.status(400).json({ success: false, message: "Image, title, and content are required." });
        }

        // Step 4: Parse headingSection
        let headingSectionRaw = [];
        if (typeof req.body.headingSection === "string") {
            try {
                headingSectionRaw = JSON.parse(req.body.headingSection);
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid headingSection JSON." });
            }
        }

        // Step 5: Upload each heading image
        const processedHeadings = await Promise.all(
            headingSectionRaw.map(async (item, index) => {
                const key = `headingSection[${index}][headingImage]`;
                let headingImageUrl = "";

                if (filesMap[key]) {
                    try {
                        const result = await uploadToCloudinary(filesMap[key]);
                        headingImageUrl = result.secure_url;
                    } catch (err) {
                        console.error(`Heading image upload failed for index ${index}:`, err.message);
                    }
                }

                return {
                    heading: item.heading,
                    headingParagraph: item.headingParagraph,
                    headingImage: headingImageUrl,
                };
            })
        );

        // Step 6: Save blog
        const newBlog = new BlogModel({
            image: mainImageUrl,
            title,
            content,
            headingSection: processedHeadings,
        });

        await newBlog.save();

        return res.status(201).json({
            success: true,
            message: "Blog added successfully",
            blog: newBlog,
        });

    } catch (err) {
        console.error("Add Blog Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding the blog.",
        });
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
        console.log("id: ", id);
        const blogData = await BlogModel.findById(id);
        console.log("blogData: ", blogData);
        return res.status(200).json({ success: true, data: blogData });
    } catch (error) {
        console.error("Error in getBlogById function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const existingBlog = await BlogModel.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }
        // Map uploaded files
        const filesMap = {};
        if (Array.isArray(req.files)) {
            req.files.forEach((file) => {
                filesMap[file.fieldname] = file;
            });
        }
        // Upload new main image (optional)
        if (filesMap["image"]) {
            try {
                const result = await uploadToCloudinary(filesMap["image"]);
                existingBlog.image = result.secure_url;
            } catch (error) {
                console.error("Main image update error:", error.message);
                return res.status(500).json({ success: false, message: "Main image update failed" });
            }
        }
        // Update basic fields if provided
        const { title, content } = req.body;
        if (title) existingBlog.title = title;
        if (content) existingBlog.content = content;
        // Parse headingSection JSON
        let headingSectionRaw = [];
        if (typeof req.body.headingSection === "string") {
            try {
                headingSectionRaw = JSON.parse(req.body.headingSection);
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid headingSection JSON." });
            }
        }
        // Process heading sections (with or without updated image)
        const updatedHeadings = await Promise.all(
            headingSectionRaw.map(async (item, index) => {
                const key = `headingSection[${index}][headingImage]`;
                let headingImageUrl = item.headingImage; // fallback to existing (string)
                if (filesMap[key]) {
                    try {
                        const result = await uploadToCloudinary(filesMap[key]);
                        headingImageUrl = result.secure_url;
                    } catch (err) {
                        console.error(`Heading image upload failed at index ${index}:`, err.message);
                    }
                }
                return {
                    heading: item.heading,
                    headingParagraph: item.headingParagraph,
                    headingImage: headingImageUrl,
                };
            })
        );
        existingBlog.headingSection = updatedHeadings;
        // Save updated blog
        await existingBlog.save();
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: existingBlog,
        });
    } catch (err) {
        console.error("Update Blog Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the blog.",
        });
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
    updateBlog,
    deleteBlog,
};
