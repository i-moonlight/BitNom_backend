"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config");
const validators = require("../common/validators");

const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: validators("email")
	},
	avatar: { type: String },
	displayName: {
		type: String,
		validate: validators("alpha"),
		required: true
	},
	slogan: { type: String },
	access: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "AccessGroup",
		validate: validators("mongoId")
	},
	date: { type: Date, required: true, validate: validators("date") },
	hash: { type: String, required: true },
	verified: { type: Boolean, required: true, default: false },
	verificationString: { type: String, required: true },
	credits: { type: Number, default: 0, required: true }
});

schema.index({ email: 1 }, { unique: true });

schema.index({ email: "text", displayName: "text" });

schema.virtual("password").set(function(value) {
	this.hash = bcrypt.hashSync(
		value,
		Number(process.env.SALT_ROUNDS) || config.saltRounds
	);
});

schema.methods.isPassword = function(password) {
	return bcrypt.compare(password, this.hash);
};

schema.methods.verify = function(str) {
	return this.verificationString === str;
};

mongoose.model("User", schema);
