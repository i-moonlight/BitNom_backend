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

			it("should filter results using _id if provided", done => {
				const variables = {
					searchString: "CoinTech",
					_id: userId
				};
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
						).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});
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
			const query = `
			mutation createTechnology($technology: TechnologyInput!) {
			  	technology {
				    create(technology: $technology) {
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

			const technology = {
				name: "IsACoin",
				focus: "Underground Banking Finance",
				description:
					"A blockchain network for underground banking finance.",
				tags: ["finance", "blockchain", "banking", "underground"],
				features: ["high security", "proof of work"],
				innovations: ["peer to peer transfers"],
				repository: "https://github.com/isacoin",
				website: "https://www.isacoin.org"
			};

			it("should require user to be logged in", done => {
				const variables = { technology };
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

			it("should ensure user has technology-create permission", done => {
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
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = { technology };
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal("Permission denied!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should validate user input");

			it("should create a new technology entry", done => {
				const accessGroup = {
					name: "canGetUser",
					permissions: [
						{
							model: "technology",
							endpoint: "create"
						}
					]
				};
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(({ _id }) => {
						return mongoose
							.model("User")
							.create(Object.assign(user, { access: _id }));
					})
					.then(user => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = { technology };
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.create).not.to.be
							.null;
						expect(response.body.data.technology.create._id).to.not
							.be.undefined;
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("vote", () => {});

		describe("delete", () => {
			const query = `
			mutation deleteTechnology(
			  	$ids: [String] = []
			) {
			  	technology {
			    	delete(ids: $ids)
			  	}
			}`;

			it("should require user to be logged in", done => {
				const variables = { ids: [] };
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

			it(`should require ownership of the technology or technology-delete
				permission`, done => {
				const technology = {
					logo: "logo.png",
					name: "CoinTech",
					focus: "finance",
					description: "a coin for finance",
					user: mongoose.Types.ObjectId(),
					repository: "http://link.com",
					date: new Date()
				};
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let technologyId;
				mongoose
					.model("User")
					.create(user)
					.then(() => mongoose.model("Technology").create(technology))
					.then(({ _id }) => (technologyId = _id))
					.then(() => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = { ids: [technologyId] };
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal(
							"Ownership or permission required!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should delete the specified technology entries", done => {
				const technology = {
					logo: "logo.png",
					name: "CoinTech",
					focus: "finance",
					description: "a coin for finance",
					user: mongoose.Types.ObjectId(),
					repository: "http://link.com",
					date: new Date()
				};
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let technologyId;
				mongoose
					.model("User")
					.create(user)
					.then(({ _id }) => {
						return mongoose
							.model("Technology")
							.create(Object.assign(technology, { user: _id }));
					})
					.then(({ _id }) => (technologyId = _id))
					.then(() => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = { ids: [technologyId] };
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.delete).to.equal(
							"ok"
						);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("update", () => {
			const query = `
			mutation updateTechnology(
			  	$_id: String = "",
			  	$technology: TechnologyInput = {}
			) {
			  	technology {
			    	update(_id: $_id, technology: $technology) {
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

			it("should require user to be logged in", done => {
				const variables = {
					_id: mongoose.Types.ObjectId(),
					technology: {}
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

			it("should ensure target resource exists", done => {
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
					.then(() => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							_id: mongoose.Types.ObjectId(),
							technology: {}
						};
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal(
							"Target resource does not exist!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should ensure user owns the technology", done => {
				const technology = {
					logo: "logo.png",
					name: "CoinTech",
					focus: "finance",
					description: "a coin for finance",
					user: mongoose.Types.ObjectId(),
					repository: "http://link.com",
					date: new Date()
				};
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let technologyId;
				mongoose
					.model("User")
					.create(user)
					.then(() => mongoose.model("Technology").create(technology))
					.then(({ _id }) => (technologyId = _id))
					.then(() => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							_id: technologyId,
							technology: {}
						};
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal("Ownership required!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should validate user input");

			it("should update the specified technology entry", done => {
				const technology = {
					logo: "logo.png",
					name: "CoinTech",
					focus: "finance",
					description: "a coin for finance",
					user: mongoose.Types.ObjectId(),
					repository: "http://link.com",
					date: new Date()
				};
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let technologyId;
				mongoose
					.model("User")
					.create(user)
					.then(({ _id }) => {
						return mongoose
							.model("Technology")
							.create(Object.assign(technology, { user: _id }));
					})
					.then(({ _id }) => (technologyId = _id))
					.then(() => {
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							_id: technologyId,
							technology: { name: "CoinTech-1" }
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
						expect(response.body.data.technology).not.to.be
							.undefined;
						expect(response.body.data.technology.update).not.to.be
							.null;
						expect(
							response.body.data.technology.update.name
						).to.equal("CoinTech-1");
						done();
					})
					.catch(helpers.logError(done));
			});
		});
	});
});
