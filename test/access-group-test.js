"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

describe("accessGroup", () => {
	describe("query", () => {
		beforeEach(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(done);
		});

		describe("get", () => {
			const query = `
			query getGroups(
				$name: String = "",
				$_id: String = "",
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				accessGroup {
					get(name: $name, _id: $_id, pagination: $pagination) {
						_id
						name
						permissions {
							_id model endpoint owned
						}
					}
					
				}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					name: "admin",
					_id: "",
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

			it("should ensure user has accessGroup-get permission");
			it("should retrieve by provided _id");
			it("should retrive all is _id is not provided");
		});
	});

	describe("mutation", () => {
		beforeEach(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(done);
		});

		describe("create", () => {
			it("should require user to be logged in");
			it("should ensure user has accessGroup-create permission");
			it("should validate user input");
			it("should create a new access group entry");
		});

		describe("delete", () => {
			it("should require user to be logged in");
			it("should ensure user has accessGroup-delete permission");
			it("should reject request to delete for admin");
			it("should delete specified access groups");
		});

		describe("deletePermission", () => {
			it("should require user to be logged in");
			it(
				"should ensure user has accessGroup-deletePermission permission"
			);
			it("should reject request to delete for admin");
			it("should delete specified permissions");
		});

		describe("update", () => {
			it("should require user to be logged in");
			it("should ensure user has accessGroup-update permission");
			it("should reject request to update for admin");
			it("should update specified access group");
		});
	});
});
