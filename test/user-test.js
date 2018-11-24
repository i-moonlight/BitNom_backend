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
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(done);
		});

		describe("get", done => {
			const query = `
			query getUser(
				$email: String = "",
				$_id: String = "",
				$access: String = "",
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				user {
					get(
						email: $email,
						_id: $_id,
						access: $access,
						pagination: $pagination
					) {
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

			it("should ensure user has user-get permission", done => {
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
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal("Permission denied!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get user by email", done => {
				let _id;
				const accessGroup = {
					name: "canGetUser",
					permissions: [
						{
							model: "user",
							endpoint: "get"
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
						expect(response.body.data.user.get).not.to.be.null;
						expect(response.body.data.user.get.length).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get user by _id", done => {
				let _id;
				const accessGroup = {
					name: "canGetUser",
					permissions: [
						{
							model: "user",
							endpoint: "get"
						}
					]
				};
				const user = {
					email: "example1@email.com",
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
						_id = user._id;
						return helpers.login(
							"example1@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							_id,
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
						expect(response.body.data.user.get).not.to.be.null;
						expect(response.body.data.user.get.length).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get users of specific access group if specified", done => {
				const accessGroup = {
					name: "canGetUser",
					permissions: [
						{
							model: "user",
							endpoint: "get"
						}
					]
				};
				let users = [
					{
						email: "example@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					},
					{
						email: "example1@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					}
				];
				let access;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(({ _id }) => {
						access = _id;
						users[0].access = _id;
						return mongoose.model("User").insertMany(users);
					})
					.then(users => {
						return helpers.login(users[0].email, "password", done);
					})
					.then(token => {
						const variables = {
							access,
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
						expect(response.body.data.user.get).not.to.be.null;
						expect(response.body.data.user.get.length).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("search", () => {
			const query = `
			query searchUser(
				$searchString: String = "",
				$access: String = "",
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				user {
					search(
						searchString: $searchString,
						access: $access,
						pagination: $pagination
					) {
						_id displayName email avatar access
					}
				}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					searchString: "example",
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

			it("should ensure user has user-search permission", done => {
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
						const variables = {
							searchString: "example",
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
						expect(response.body.errors).not.to.be.undefined;
						expect(response.body.errors.length).not.to.equal(0);
						let qlRes = response.body.errors[0];
						expect(qlRes.message).to.equal("Permission denied!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get matching entries only", done => {
				const accessGroup = {
					name: "canSearchUser",
					permissions: [
						{
							model: "user",
							endpoint: "search"
						}
					]
				};
				let users = [
					{
						email: "example@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					},
					{
						email: "sample@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					}
				];
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(({ _id }) => {
						users[0].access = _id;
						return mongoose.model("User").insertMany(users);
					})
					.then(users => {
						return helpers.login(users[0].email, "password", done);
					})
					.then(token => {
						const variables = {
							searchString: "example",
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
						expect(response.body.data.user.search).not.to.be.null;
						expect(response.body.data.user.search.length).to.equal(
							1
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should get users with specific access group if specified", done => {
				const accessGroup = {
					name: "canSearchUser",
					permissions: [
						{
							model: "user",
							endpoint: "search"
						}
					]
				};
				let users = [
					{
						email: "example@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					},
					{
						email: "example-1@email.com",
						access: mongoose.Types.ObjectId(),
						date: new Date(),
						password: "password",
						verificationString: "verificationString"
					}
				];
				let access;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(({ _id }) => {
						access = _id;
						users[0].access = _id;
						return mongoose.model("User").insertMany(users);
					})
					.then(users => {
						return helpers.login(users[0].email, "password", done);
					})
					.then(token => {
						const variables = {
							searchString: "email",
							access,
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
						expect(response.body.data.user.search).not.to.be.null;
						expect(response.body.data.user.search.length).to.equal(
							1
						);
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
				.then(() => mongoose.model("AccessGroup").deleteMany({}))
				.then(() => done())
				.catch(done);
		});

		describe("create", () => {
			const query = `
			mutation createUser(
				$email: String = "",
				$password: String = ""
			) {
				user {
					create(email: $email, password: $password) {
						_id displayName email avatar access
					}
				}
			}`;

			it("should validate user input");

			it("should create a new user", done => {
				const variables = {
					email: "example@email.com",
					password: "password"
				};
				helpers
					.runQuery({ query, variables })
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user).not.to.be.undefined;
						expect(response.body.data.user.create).not.to.be.null;
						expect(response.body.data.user.create._id).not.to.be
							.undefined;
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("changePassword", () => {
			const query = `
			mutation changePassword(
				$oldPassword: String = "",
				$newPassword: String = "",
				$confirmPassword: String = ""
			) {
				user {
					changePassword(
						oldPassword: $oldPassword,
						newPassword: $newPassword,
						confirmPassword: $confirmPassword
					)
				}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					oldPassword: "password",
					newPassword: "new-password",
					confirmPassword: "new-password"
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

			it("should validate password");

			it("should ensure old password is correct", done => {
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
						const variables = {
							oldPassword: "wrong-password",
							newPassword: "new-password",
							confirmPassword: "new-password"
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
						expect(qlRes.message).to.equal("Incorrect password!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should ensure both submitted passwords match", done => {
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
						const variables = {
							oldPassword: "password",
							newPassword: "new-password",
							confirmPassword: "mismatch"
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
						expect(qlRes.message).to.equal("Passwords mismatch!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should change the user's password");
		});

		describe("updateDisplayName", () => {
			it("should require user to be logged in");
			it("should validate user input");
			it("should update the user's display name");
		});

		describe("updateAccessGroup", () => {
			it("should require user to be logged in");
			it("should ensure user has user-updateAccessGroup permission");
			it("should reject invalid user _id");
			it("should reject request to modify admin");
			it("should update access group");
		});

		describe("resetPassword", () => {
			it("should reject invalid user email");
			it("should reset user's password");
		});

		describe("delete", () => {
			it("should require user to be logged in");
			it("should ensure user has user-delete permission");
			it("should reject request to delete admin");
			it("should delete specified users");
		});
	});
});
