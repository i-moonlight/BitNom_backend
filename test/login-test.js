"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

before(done => {
	require("../models")();
	const config = require("../config");

	console.log("Setting up database ... ");

	mongoose
		.connect(config.dbUrl, {
			useCreateIndex: true,
			useNewUrlParser: true
		})
		.then(() => done())
		.catch(done);
});

after(done => {
	mongoose
		.disconnect()
		.then(() => done())
		.catch(done);
});

describe("login", () => {
	describe("query", () => {
		before(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => done())
				.catch(done);
		});

		const query = `
		query ($email: String!, $password:String!) {
		 	login(email: $email, password: $password)
		}`;

		it("should reject invalid credentials.", done => {
			const variables = {
				email: "example@email.com",
				password: "password"
			};
			helpers
				.runQuery({ query, variables }, null, done)
				.then(response => {
					expect(response.body).not.to.be.undefined;
					expect(response.body.errors).not.to.be.undefined;
					expect(response.body.errors.length).not.to.equal(0);
					const qlRes = response.body.errors[0];
					expect(qlRes.message).to.equal(
						"Invalid email or password!"
					);
					done();
				})
				.catch(helpers.logError(done));
		});

		it("should return token for valid credentials", done => {
			const user = {
				email: "example@email.com",
				access: mongoose.Types.ObjectId(),
				date: new Date(),
				password: "password",
				verificationString: "verificationString"
			};
			const variables = {
				email: "example@email.com",
				password: "password"
			};
			mongoose
				.model("User")
				.create(user)
				.then(user => {
					return helpers.runQuery({ query, variables }, null, done);
				})
				.then(response => {
					expect(response.body).not.to.be.undefined;
					expect(response.body.data).not.to.be.undefined;
					expect(typeof response.body.data.login).to.equal("string");
					done();
				})
				.catch(helpers.logError(done));
		});
	});
});
