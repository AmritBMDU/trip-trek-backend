const PackageModel = require("../models/Package.model");
const { uploadToCloudinary } = require("../middlewares/cloudinary.middleware");


const addPackage = async (req, res) => {
    try {
        // Upload image
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        // Parse JSON fields if needed
        const parseField = (fieldName) => {
            if (req.body[fieldName] && typeof req.body[fieldName] === "string") {
                try {
                    req.body[fieldName] = JSON.parse(req.body[fieldName]);
                } catch (err) {
                    console.error(`Invalid format for ${fieldName}`);
                    return false;
                }
            }
            return true;
        };

        const jsonFields = ["includes", "SpecialtyTours", "inclusive", "exclusive", "notes", "cancellationPolicy", "itinerary"];
        for (let field of jsonFields) {
            if (!parseField(field)) {
                return res.status(400).json({ success: false, message: `Invalid format for ${field} field` });
            }
        }

        const {
            image,
            duration,
            location,
            includes,
            SpecialtyTours,
            packageName,
            mainPrice,
            discountPrice,
        } = req.body;

        // Required field validation
        if (!image || !duration || !location || !packageName || !mainPrice || !discountPrice) {
            return res.status(422).json({ success: false, message: "All required fields must be filled" });
        }

        // Create and save the package
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
        if (!id) {
            return res.status(400).json({ success: false, message: "Package ID not found!" });
        }

        const editPackage = await PackageModel.findById(id);
        if (!editPackage) {
            return res.status(404).json({ success: false, message: "Package not found!" });
        }

        // Upload image only if file is provided
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file);
                req.body.image = result.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        // These fields may come as JSON strings
        const jsonFields = ["includes", "SpecialtyTours", "inclusive", "exclusive", "notes", "cancellationPolicy", "itinerary"];
        for (let field of jsonFields) {
            if (req.body[field] && typeof req.body[field] === "string") {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (err) {
                    return res.status(400).json({ success: false, message: `Invalid JSON format in '${field}'` });
                }
            }
        }

        // Update only non-empty, non-null, changed fields
        let isAnyFieldUpdated = false;
        Object.keys(req.body).forEach((key) => {
            const newValue = req.body[key];

            // Ignore undefined, null, or blank string values
            const isValid =
                newValue !== undefined &&
                newValue !== null &&
                !(typeof newValue === "string" && newValue.trim() === "");

            if (isValid) {
                const currentValue = editPackage[key];

                // Compare deeply (for objects and arrays too)
                const currentStr = JSON.stringify(currentValue);
                const newStr = JSON.stringify(newValue);

                if (currentStr !== newStr) {
                    editPackage[key] = newValue;
                    isAnyFieldUpdated = true;
                }
            }
        });

        if (!isAnyFieldUpdated) {
            return res.status(400).json({ success: false, message: "No valid input fields provided" });
        }

        await editPackage.save();

        return res.status(200).json({
            success: true,
            message: "Package updated successfully",
            data: editPackage,
        });

    } catch (error) {
        console.error("Error in putPackage:", error.message);
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
};


module.exports = {
    addPackage,
    getPackage,
    getPackageById,
    putPackage,
    deletePackage,
};
