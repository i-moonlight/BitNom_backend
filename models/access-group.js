"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	name: { type: String, required: true },
	permissions: [
		{
			model: { type: String, required: true },
			endpoint: { type: String, required: true },
			owned: { type: Boolean, required: true, default: false }
		}
	]
});

schema.index({ name: 1 }, { unique: true });
schema.index(
	{
		name: 1,
		"permissions.model": 1,
		"permissions.endpoint": 1
	},
	{ unique: true }
);

mongoose.model("AccessGroup", schema);
