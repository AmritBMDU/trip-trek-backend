const PackageModel = require("../models/Package.model");
const { uploadToCloudinary } = require("../middlewares/cloudinary.middleware");

const addPackage = async (req, res) => {
    try {
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }
        const { image, duration, location, includes, packageName, mainPrice, discountPrice } = req.body;
        if (!image || !duration || !location || !includes || !packageName || !mainPrice || !discountPrice) {
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

const getPackageById = async (req, res) => {
    try {
        const id = req.params.id;
        const packageData = await PackageModel.findById(id);
        return res.status(200).json({ success: true, data: packageData });
    } catch (error) {
        console.error("Error in getPackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const putPackage = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ success: false, message: "id not found!" })
        const editPackage = await PackageModel.findById(id);
        if (!editPackage) return res.status(404).json({ success: false, message: "EditPackage not found!" })
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }
        let isAnyFieldUpdated = false;
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key].toString().trim() !== "") {
                editPackage[key] = req.body[key];
                isAnyFieldUpdated = true;
            }
        });

        if (!isAnyFieldUpdated) return res.status(400).json({ success: false, message: "No valid input fields provided" })
        await editPackage.save();
        return res.status(201).json({
            message: "Package is updated Successfully",
            success: true
        })
    } catch (error) {
        console.error("Error in putPackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const deletePackage = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ success: false, message: "Id not found!" });
        await PackageModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Package Deleted successfully" })
    } catch (error) {
        console.error("Error in updatePackage function:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


module.exports = {
    addPackage,
    getPackage,
    getPackageById,
    putPackage,
    deletePackage,
};
