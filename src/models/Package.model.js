const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    image: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    includes: [{ type: String }],
    packageName: { type: String },
    mainPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("packageModel", packageSchema);
