"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	target: { type: mongoose.Schema.Types.ObjectId, required: true },
	description: { type: String, required: true },
	code: { type: String, required: true },
	date: { type: Date, required: true }
});

schema.index({ description: "text" });

mongoose.model("SourceCode", schema);
