const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const headingSchema = new Schema({
    heading: { type: String, required: true },
    headingImage: { type: String, required: true },
    headingParagraph: { type: String, required: true }
});


const BlogSchema = new Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    headingSection: { type: [headingSchema], default: [] }
}, {
    timestamps: true
})

module.exports = mongoose.model("BlogModel", BlogSchema);