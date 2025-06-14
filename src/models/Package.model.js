const mongoose = require('mongoose');
const Schema = mongoose.Schema;  
const itinerarySchema = new Schema({
    day: { type: Number },
    date: { type: String },
    fromDestination: { type: String },
    toDestination: { type: String },
    activity: { type: String },
    hotelName: { type: String },
    hotelRating: { type: Number },
    shortDescription: { type: String },
});

const packageSchema = new Schema({
    image: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    includes: { type: [String], default: [] },
    SpecialtyTours: { type: [String], default: [] },
    packageName: { type: String, required: true },
    mainPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    packageOverView: { type: String },
    inclusive: { type: [String], default: [] },
    exclusive: { type: [String], default: [] },
    notes: { type: [String], default: [] },
    cancellationPolicy: { type: [String], default: [] },
    itinerary: { type: [itinerarySchema], default: [] },
}, {
    timestamps: true
});

module.exports = mongoose.model("PackageModel", packageSchema);
