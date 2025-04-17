const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    PackageName: { type: String, required: true },
    PackageId: { type: String, required: true },
    MobileNumber: { type: Number, required: true },
    Adult: { type: Number, required: true },
    Child: { type: Number, required: true },
    Infant: { type: Number, required: true },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('leadModel', leadSchema);