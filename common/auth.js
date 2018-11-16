"use strict";

module.exports = {
	loginRequired(req) {
		if (!req.user) return Promise.reject(new Error("Login required!"));
		return Promise.resolve();
	}
};
