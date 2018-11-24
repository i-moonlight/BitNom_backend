"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

describe("technology", () => {
	describe("query", () => {
		beforeEach(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => mongoose.model("Technology").deleteMany({}))
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(helpers.logError(done));
		});

		describe("get", () => {
			const query = `
			query getTechnologies(
				$_id: String = "",
				$name: String = "",
			  	$pagination: PaginationInput = {}
			) {
			  	technology {
			    	get(_id: $_id, name: $name, pagination: $pagination) {
			      		_id
			      		logo
			    		name
			    		focus
			    		description
			    		tags
			    		features
			    		innovations
			    		repository
			    		website
			      		user
			      		follows
			      		date
			    	}
			  	}
			}`;

			let sampleSavedId;

			beforeEach(done => {
				const technologies = [
					{
						logo: "logo.png",
						name: "CoinTech",
						focus: "finance",
						description: "a coin for finance",
						user: mongoose.Types.ObjectId(),
						repository: "http://link.com",
						date: new Date()
					},
					{
						logo: "logo.png",
						name: "CoinTech-1",
						focus: "finance",
						description: "a coin for finance",
						user: mongoose.Types.ObjectId(),
						repository: "http://link.com",
						date: new Date()
					},
					{
						logo: "logo.png",
						name: "CoinTech-2",
						focus: "finance",
						description: "a coin for finance",
						user: mongoose.Types.ObjectId(),
						repository: "http://link.com",
						date: new Date()
					}
				];
				mongoose
					.model("Technology")
					.insertMany(technologies)
					.then(technologies => {
						sampleSavedId = technologies[0]._id;
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should retrieve using provided _id", done => {
				helpers
					.runQuery({ query, variables: { _id: sampleSavedId } })
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.get).not.to.be
							.null;
						expect(
							response.body.data.technology.get.length
						).to.equal(1);
						expect(
							response.body.data.technology.get[0]._id
						).to.equal(String(sampleSavedId));
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should retrieve using provided name", done => {
				helpers
					.runQuery({ query, variables: { name: "CoinTech" } })
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.get).not.to.be
							.null;
						expect(
							response.body.data.technology.get.length
						).to.equal(1);
						expect(
							response.body.data.technology.get[0].name
						).to.equal(String("CoinTech"));
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should return all if _id and/or name is not provided", done => {
				helpers
					.runQuery({ query })
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.get).not.to.be
							.null;
						expect(
							response.body.data.technology.get.length
						).to.equal(3);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("search", () => {
			const query = `
			query getTechnologies(
				$_id: String = "",
				$searchString: String = "",
			  	$pagination: PaginationInput = {}
			) {
			  	technology {
			    	search(
			    		_id: $_id,
			    		searchString: $searchString,
			    		pagination: $pagination
			    	) {
			      		_id
			      		logo
			    		name
			    		focus
			    		description
			    		tags
			    		features
			    		innovations
			    		repository
			    		website
			      		user
			      		follows
			      		date
			    	}
			  	}
			}`;

			let userId = mongoose.Types.ObjectId();

			beforeEach(done => {
				const technologies = [
					{
						logo: "logo.png",
						name: "CoinTech",
						focus: "finance",
						description: "a coin for finance",
						user: mongoose.Types.ObjectId(),
						repository: "http://link.com",
						date: new Date()
					},
					{
						logo: "logo.png",
						name: "CoinTech-1",
						focus: "finance",
						description: "a coin for finance",
						user: userId,
						repository: "http://link.com",
						date: new Date()
					},
					{
						logo: "logo.png",
						name: "DiffTech",
						focus: "diversity",
						description: "a platform for the divergent",
						user: userId,
						repository: "http://link.com",
						date: new Date()
					}
				];

				mongoose
					.model("Technology")
					.insertMany(technologies)
					.then(() => done())
					.catch(helpers.logError(done));
			});

			it("should return matching entries", done => {
				const variables = { searchString: "CoinTech" };
				helpers
					.runQuery({ query, variables })
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.get).not.to.be
							.null;
						expect(
							response.body.data.technology.search.length
						).to.equal(2);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should filter results using _id if provided");
		});
	});

	describe("mutation", () => {
		beforeEach(done => {
			mongoose
				.model("User")
				.deleteMany({})
				.then(() => mongoose.model("Technology").deleteMany({}))
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(error => helpers.logError(error));
		});

		describe("create", () => {
			it("should require user to be logged in");
			it("should ensure user has technology-create permission");
			it("should validate user input");
			it("should create a new technology entry");
		});

		describe("vote", () => {});

		describe("delete", () => {
			it("should require user to be logged in");
			it("should ensure user owns the technology");
			it("should delete the specified technology entries");
		});

		describe("update", () => {
			it("should require user to be logged in");
			it("should ensure user owns the technology");
			it("should validate user input");
			it("should update the specified technology entry");
		});
	});
});
