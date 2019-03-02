"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	resource: { type: mongoose.Schema.Types.ObjectId, required: true },
	parentMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ResourceMessage"
	},
	text: { type: String, required: true },
	date: { type: Date, required: true }
});

mongoose.model("ResourceMessage", schema);
