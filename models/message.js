"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	text: { type: String, required: true },
	date: { type: Date, required: true },
	read: { type: Boolean, required: true, default: false }
});

mongoose.model("Message", schema);
