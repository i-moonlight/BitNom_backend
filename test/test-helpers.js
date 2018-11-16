"use strict";

const superagent = require("superagent");
const mongoose = require("mongoose");

const apiEndpoint = "http://localhost:3000/graphql";

module.exports = {
	runQuery(query, token, done) {
		const headers = token ? `Bearer ${token}` : {};
		return superagent
			.post(apiEndpoint)
			.set(headers)
			.send(query)
			.then(response => response);
	},
	logError(done) {
		return error => {
			error.response ? done(new Error(error.response.text)) : done(error);
		};
	}
};
