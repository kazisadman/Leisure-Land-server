const { default: mongoose } = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
  },
  { collection: "places" }
);

const Places = mongoose.model("Place", placeSchema);

module.exports = Places;
