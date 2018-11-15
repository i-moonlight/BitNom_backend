"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	logo: { type: String },
	name: { type: String, required: true },
	focus: { type: String, required: true },
	description: { type: String, required: true },
	tags: [{ type: String }],
	features: [{ type: String }],
	innovations: [{ type: String }],
	repository: { type: String, required: true },
	website: { type: String },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	follows: { type: Number, min: 0, default: 0, required: true },
	date: { type: Date, required: true }
});

schema.index({ name: 1 }, { unique: true });
schema.index({
	name: "text",
	focus: "text",
	tags: "text",
	features: "text",
	innovations: "text"
});

mongoose.model("Technology", schema);
