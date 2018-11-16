"use strict";

const superagent = require("superagent");
const mongoose = require("mongoose");

const apiEndpoint = "http://localhost:3000/graphql";

module.exports = {
	runQuery(query, token, done) {
		const headers = token ? { Authorization: `Bearer ${token}` } : {};
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
	},
	login(email, password, done) {
		const variables = { email, password };
		const query = `
		query ($email: String!, $password:String!) {
		 	login(email: $email, password: $password)
		}`;
		return this.runQuery({ query, variables }, null, done).then(
			response => response.body.data.login
		);
	}
};
