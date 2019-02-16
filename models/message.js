"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	avatar: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	recepient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	thread: { type: mongoose.Schema.Types.ObjectId },
	upvotes: { type: Number, min: 0, default: 0, required: true },
	flags: { type: Number, min: 0, default: 0, required: true },
	date: { type: Date, required: true },
	read: { type: Boolean, required: true, default: false }
});

mongoose.model("Message", schema);
