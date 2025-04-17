const Lead = require('../models/Lead.model');

const addLead = async (req, res) => {
    try {
        const { Name, Email, PackageName, PackageId, MobileNumber, Adult, Child, Infant } = req.body;
        if (!Name || !Email || !PackageName || !PackageId || !MobileNumber || Adult === undefined || Child === undefined || Infant === undefined) {
            return res.status(422).json({ success: false, message: "All fields are required" });
        }
        const newLead = await Lead.create(req.body);
        return res.status(201).json({ success: true, message: "Submitted successfully", data: newLead });
    } catch (error) {
        console.error("Error in addLead:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getLead = async (req, res) => {
    try {
        const leadData = await Lead.find({});
        return res.status(200).json({ success: true, data: leadData });
    } catch (error) {
        console.error("Error in getLead:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    addLead,
    getLead,
};
