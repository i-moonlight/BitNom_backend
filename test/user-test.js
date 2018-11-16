"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

describe("user", () => {
	describe("query", () => {
		beforeEach(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => done())
				.catch(done);
		});

		describe("get", done => {
			const query = `
			query getUser(
				$email: String = "",
				$_id: String = "",
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				user {
					get(email: $email, _id: $_id, pagination: $pagination) {
						_id displayName email avatar access
					}
				}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					email: "example@email.com",
					pagination: {}
				};
				helpers
					.runQuery({ query, variables }, null, done)
					.then(response => {
						expect(response).to.not.be.undefined;
						expect(response.body).to.not.be.undefined;
						expect(response.body.errors).to.not.be.undefined;
						expect(response.body.errors.length).to.not.equal(0);
						const qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal("Login required!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get user by email", done => {
				let _id;
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				mongoose
					.model("User")
					.create(user)
					.then(user => {
						_id = user._id;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							email: "example@email.com",
							pagination: {}
						};
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user).not.to.be.undefined;
						expect(response.body.data.user.get.length).not.to.equal(
							0
						);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("search", () => {});
	});

	describe("mutation", () => {
		describe("create", () => {});
		describe("changePassword", () => {});
		describe("updateDisplayName", () => {});
		describe("updateAccessGroup", () => {});
		describe("resetPassword", () => {});
		describe("delete", () => {});
	});
});
