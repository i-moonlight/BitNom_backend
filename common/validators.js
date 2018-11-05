"use strict";

const validator = require("validator");

const validators = {
	phoneNumber: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isMobilePhone(val, "en-KE", { strict: true });
		},
		msg: "Should be a valid mobile phone."
	},
	mongoId: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isMongoId(val);
		},
		msg: "Should be a valid ID."
	},
	password: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			let regex = new RegExp(
				"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
			);
			return val.match(regex) !== null;
		},
		msg:
			"Password must be at least 8 characters long and " +
			"contain at least 1 uppercase and 1 lowercase letter, " +
			"1 numeric character and 1 special character."
	},
	alpha: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isAlpha(val);
		},
		msg: "Field cannot contain numbers or special characters."
	},
	email: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isEmail(val);
		},
		msg: "Field value should be a valid email."
	},
	number: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isNumeric(val, { no_symbols: true });
		},
		msg: "Field value should be a valid number."
	},
	date: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.toDate(val) !== null;
		},
		msg: "Field should be a valid date"
	},
	beforeNow: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isAfter(val) === true;
		},
		msg: "Field value should less than now"
	},
	afterNow: {
		validator(val) {
			if (!val) return true;
			val = String(val);
			return validator.isAfter(val) !== true;
		},
		msg: "Field value should greater than now"
	}
};

module.exports = function() {
	return Array.from(arguments).map(val => validators[val]);
};
