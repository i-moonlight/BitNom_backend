"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	avatar: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	model: { type: String, required: true },
	resource: { type: mongoose.Schema.Types.ObjectId, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	upvotes: { type: Number, min: 0, default: 0, required: true },
	downvotes: { type: Number, min: 0, default: 0, required: true },
	flags: { type: Number, min: 0, default: 0, required: true },
	date: { type: Date, required: true },
	read: { type: Boolean, required: true, default: false }
});

mongoose.model("Notification", schema);

