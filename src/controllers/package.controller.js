const PackageModel = require("../models/Package.model");
const { uploadToCloudinary } = require("../middlewares/cloudinary.middleware");

const addPackage = async (req, res) => {
    try {
        console.log("data: ",req.body);
        console.log("file: ",req.file);
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
                console.log("url: ",result.secure_url)
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }
        console.log("data2nd: ",req.body);
        const { image, duration, location, includes, mainPrice, discountPrice } = req.body;
        if (!image || !duration || !location || !includes || !mainPrice || !discountPrice) {
            return res.status(422).json({ success: false, message: "All fields are required" });
        }
        const newPackage = await PackageModel.create(req.body);
        return res.status(201).json({ success: true, message: "Package added successfully", data: newPackage });
    } catch (error) {
        console.error("Error in addPackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getPackage = async (req, res) => {
    try {
        const packageData = await PackageModel.find({});
        return res.status(200).json({ success: true, data: packageData });
    } catch (error) {
        console.error("Error in getPackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    addPackage,
    getPackage,
};
