"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	upvote: { type: Boolean, required: true },
	resource: { type: mongoose.Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true }
});

mongoose.model("Vote", schema);
