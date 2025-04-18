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

const putLead = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id: ",id)
        console.log("body: ",req.body)
        if (!id) return res.status(400).json({ success: false, message: "Id Not found" });
        const editLead = await Lead.findById(id);
        if (!editLead) return res.status(404).json({ success: false, message: "Lead document not found" });

        let isAnyFieldUpdated = false;
        Object.keys(req.body).forEach((key)=>{
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key].toString().trim() !== "") {
                editLead [key] = req.body[key];
                isAnyFieldUpdated = true;
            }
        });
        if(!isAnyFieldUpdated) return res.status(400).json({success:false,message:"No valid input fields provided"})
        await editLead.save();
        return res.status(200).json({success:true,message:"Leads Document updated successfully"})
    } catch (error) {
        console.error("Error in putLead:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const deleteLead = async (req,res)=>{
    try {
        const id = req.params.id;
        console.log("id: ",id)
        if (!id) return res.status(400).json({ success: false, message: "Id Not found" });
        await Lead.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Lead Deleted successfully" })
    } catch (error) {
        console.error("Error in deleteLead:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
module.exports = {
    addLead,
    getLead,
    putLead,
    deleteLead,
};
