"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	invoiceId: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	candidate: { type: mongoose.Schema.Types.ObjectId, required: true },
	amount: { type: Number, min: 0, required: true },
	date: { type: Date, required: true }
});

schema.index({ invoiceId: 1 }, { unique: true });
schema.index({ user: 1 });
schema.index({ candidate: 1 });

mongoose.model("Vote", schema);
