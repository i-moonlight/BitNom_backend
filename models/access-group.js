"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	name: { type: String, required: true },
	permissions: [
		{
			name: { type: String, required: true },
			create: { type: Boolean, default: false, required: true },
			read: { type: Boolean, default: false, required: true },
			update: { type: Boolean, default: false, required: true },
			delete: { type: Boolean, default: false, required: true }
		}
	]
});

schema.index({ name: 1 }, { unique: true });
schema.index({ name: 1, "permissions.name": 1 }, { unique: true });

mongoose.model("AccessGroup", schema);
