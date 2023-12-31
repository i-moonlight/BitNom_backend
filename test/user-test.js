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

			it("should change the user's password", done => {
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let oldHash;
				mongoose
					.model("User")
					.create(user)
					.then(user => {
						oldHash = user.hash;
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
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user.changePassword).to.equal(
							"ok"
						);
					})
					.then(() => mongoose.model("User").findOne({}))
					.then(user => {
						expect(user.hash).not.to.equal(oldHash);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("updateDisplayName", () => {
			const query = `
			mutation updateUserDisplayName(
				$displayName:String = ""
			) {
				user {
					updateDisplayName(displayName: $displayName) {
			    		_id displayName email avatar access
			    	}
				}
			}`;

			it("should require user to be logged in", done => {
				const variables = { displayName: "DisplayName" };
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

			it("should validate user input");

			it("should update the user's display name", done => {
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				const variables = {
					displayName: "DisplayName"
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
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user.updateDisplayName).not.to
							.be.null;
						expect(
							response.body.data.user.updateDisplayName
								.displayName
						).to.equal(variables.displayName);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("updateAccessGroup", () => {
			const query = `
			mutation updateUserAccessGroup(
				$_id: String = "",
				$accessGroup:String = ""
			) {
				user {
			   		updateAccessGroup(_id: $_id, accessGroup: $accessGroup) {
			    		_id displayName email avatar access
			    	}
			  	}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
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

			it("should ensure user has user-updateAccessGroup permission", done => {
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				const variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
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

			it("should require target user to exist", done => {
				const accessGroup = {
					name: "canUpdateAccessGroup",
					permissions: [
						{
							model: "user",
							endpoint: "updateAccessGroup"
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
				let variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
				};
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(({ _id }) => {
						variables.accessGroup = _id;
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

			it("should require specified access group to exist", done => {
				const accessGroup = {
					name: "canUpdateAccessGroup",
					permissions: [
						{
							model: "user",
							endpoint: "updateAccessGroup"
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
				let variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
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
						variables._id = user._id;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
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
							"Specified access group does not exist!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to modify admin", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					},
					{
						name: "canUpdateAccessGroup",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					}
				];
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
				};
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(groups => {
						variables.accessGroup = groups[1]._id;
						return mongoose
							.model("User")
							.create(
								Object.assign(user, { access: groups[0]._id })
							);
					})
					.then(user => {
						variables._id = user._id;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
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
							"Cannot modify admin's access group!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to set user's access group to admin", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					},
					{
						name: "canUpdateAccessGroup",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					}
				];
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
				};
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(groups => {
						variables.accessGroup = groups[0]._id;
						return mongoose
							.model("User")
							.create(
								Object.assign(user, { access: groups[1]._id })
							);
					})
					.then(user => {
						variables._id = user._id;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
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
							"Cannot set user access group to admin!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should update access group", done => {
				const accessGroups = [
					{
						name: "canAlsoUpdateAccessGroup",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					},
					{
						name: "canUpdateAccessGroup",
						permissions: [
							{
								model: "user",
								endpoint: "updateAccessGroup"
							}
						]
					}
				];
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let variables = {
					_id: mongoose.Types.ObjectId(),
					accessGroup: mongoose.Types.ObjectId()
				};
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(groups => {
						variables.accessGroup = groups[1]._id;
						return mongoose
							.model("User")
							.create(
								Object.assign(user, { access: groups[0]._id })
							);
					})
					.then(user => {
						variables._id = user._id;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user.updateAccessGroup).not.to
							.be.null;
						expect(
							response.body.data.user.updateAccessGroup.access
						).to.equal(String(variables.accessGroup));
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("resetPassword", () => {
			const query = `
			mutation resetUserPassword (
			 	$email: String = ""
			) {
			  	user {
			    	resetPassword(email: $email)
			  	}
			}`;

			it("should reject invalid user email");

			it("should require user by email to exist", done => {
				const variables = { email: "example@email.com" };
				helpers
					.runQuery({ query, variables })
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

			it("should reset user's password", done => {
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				let oldHash;
				mongoose
					.model("User")
					.create(user)
					.then(user => {
						oldHash = user.hash;
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						const variables = {
							email: "example@email.com"
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
						expect(response.body.data.user.resetPassword).to.equal(
							"ok"
						);
					})
					.then(() => mongoose.model("User").findOne({}))
					.then(user => {
						expect(user.hash).not.to.equal(oldHash);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("delete", () => {
			const query = `
			mutation deleteUser(
				$ids: [String] = ["5be3e6a04c04fa54dded0224"]
			) {
			  	user {
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

			it("should ensure user has user-delete permission", done => {
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
						const variables = { ids: [] };
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

			it("should reject request to delete admin", done => {
				const accessGroup = {
					name: "admin",
					permissions: [
						{
							model: "user",
							endpoint: "delete"
						}
					]
				};
				let variables = { ids: [] };
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(group => {
						const users = [
							{
								email: "example@email.com",
								access: group._id,
								date: new Date(),
								password: "password",
								verificationString: "verificationString"
							},
							{
								email: "example1@email.com",
								access: group._id,
								date: new Date(),
								password: "password",
								verificationString: "verificationString"
							}
						];
						return mongoose
							.model("User")
							.insertMany(Object.assign(users));
					})
					.then(users => {
						variables.ids = [users[1]._id];
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
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
							"Cannot delete an admin user!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to delete self", done => {
				const accessGroup = {
					name: "canDeleteUser",
					permissions: [
						{
							model: "user",
							endpoint: "delete"
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
				let variables = { ids: [] };
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(group => {
						return mongoose
							.model("User")
							.create(Object.assign(user, { access: group._id }));
					})
					.then(user => {
						variables.ids = [user._id];
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
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
						expect(qlRes.message).to.equal("Cannot delete self!");
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should delete specified users", done => {
				const accessGroup = {
					name: "canDeleteUser",
					permissions: [
						{
							model: "user",
							endpoint: "delete"
						}
					]
				};
				let variables = { ids: [] };
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(group => {
						const users = [
							{
								email: "example@email.com",
								access: group._id,
								date: new Date(),
								password: "password",
								verificationString: "verificationString"
							},
							{
								email: "example1@email.com",
								access: group._id,
								date: new Date(),
								password: "password",
								verificationString: "verificationString"
							},
							{
								email: "example2@email.com",
								access: group._id,
								date: new Date(),
								password: "password",
								verificationString: "verificationString"
							}
						];
						return mongoose
							.model("User")
							.insertMany(Object.assign(users));
					})
					.then(users => {
						variables.ids = [users[1]._id, users[2]._id];
						return helpers.login(
							"example@email.com",
							"password",
							done
						);
					})
					.then(token => {
						return helpers.runQuery(
							{ query, variables },
							token,
							done
						);
					})
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.user.delete).to.equal("ok");
					})
					.then(() => {
						return mongoose
							.model("User")
							.find({})
							.then(users => {
								expect(users.length).to.equal(1);
								done();
							});
					})
					.catch(helpers.logError(done));
			});
		});
	});
});
