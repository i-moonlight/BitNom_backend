"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: String,
		enum: ["srccode", "feature", "other"],
		required: true,
		default: "other"
	},
	srccodes: [{ type: String }],
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	upvotes: { type: Number, min: 0, default: 0, required: true },
	downvotes: { type: Number, min: 0, default: 0, required: true },
	flags: { type: Number, min: 0, default: 0, required: true },
	date: { type: Date, required: true },
	coin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

mongoose.model("Thread", schema);
