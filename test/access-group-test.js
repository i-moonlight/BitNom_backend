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

			it("should ensure user has accessGroup-get permission", done => {
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
							name: "",
							_id: mongoose.Types.ObjectId(),
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

			it("should retrieve by provided _id", done => {
				const accessGroups = [
					{
						name: "canGetAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canGetUser",
						permissions: [
							{
								model: "user",
								endpoint: "get"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose
							.model("User")
							.create(
								Object.assign(user, { access: accessGroupId })
							);
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
							_id: accessGroupId,
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
						expect(response.body.data.accessGroup).not.to.be
							.undefined;
						expect(response.body.data.accessGroup.get).not.to.be
							.null;
						expect(
							response.body.data.accessGroup.get.length
						).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should retrieve by provided name", done => {
				const accessGroups = [
					{
						name: "canGetAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canGetUser",
						permissions: [
							{
								model: "user",
								endpoint: "get"
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
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						let access = accessGroups[0]._id;
						return mongoose
							.model("User")
							.create(Object.assign(user, { access }));
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
							name: "canGetAccessGroup",
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
						expect(response.body.data.accessGroup).not.to.be
							.undefined;
						expect(response.body.data.accessGroup.get).not.to.be
							.null;
						expect(
							response.body.data.accessGroup.get.length
						).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should retrive all if _id and name are not provided", done => {
				const accessGroups = [
					{
						name: "canGetAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canGetUser",
						permissions: [
							{
								model: "user",
								endpoint: "get"
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
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						let access = accessGroups[0]._id;
						return mongoose
							.model("User")
							.create(Object.assign(user, { access }));
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
						expect(response.body.data.accessGroup).not.to.be
							.undefined;
						expect(response.body.data.accessGroup.get).not.to.be
							.null;
						expect(
							response.body.data.accessGroup.get.length
						).to.equal(2);
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
			mutation createGroup(
				$name: String = "",
			  	$permissions: [PermissionsInput]! = []
			) {
				accessGroup {
					create(name: $name, permissions: $permissions) {
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
					name: "canGetAccessGroup",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "get"
						}
					],
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

			it("should ensure user has accessGroup-create permission", done => {
				const user = {
					email: "example@email.com",
					access: mongoose.Types.ObjectId(),
					date: new Date(),
					password: "password",
					verificationString: "verificationString"
				};
				const variables = {
					name: "canGetAccessGroup",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "get"
						}
					],
					pagination: {}
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

			it("should validate user input");

			it("should create a new access group entry", done => {
				const accessGroup = {
					name: "canCreateAccessGroup",
					permissions: [
						{
							model: "accessGroup",
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
						const variables = {
							name: "canGetAccessGroup",
							permissions: [
								{
									model: "accessGroup",
									endpoint: "get"
								}
							],
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
						expect(response.body.data.accessGroup).not.to.be
							.undefined;
						expect(response.body.data.accessGroup.create).not.to.be
							.null;
						expect(response.body.data.accessGroup.create._id).not.to
							.be.undefined;
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("delete", () => {
			const query = `
			mutation deleteGroup($ids:[String] = []) {
			  	accessGroup {
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

			it("should ensure user has accessGroup-delete permission", done => {
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

			it("should reject request to delete admin access group", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canDeleteAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "delete"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							ids: [accessGroupId],
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
						expect(qlRes.message).to.equal(
							"Cannot delete admin access group!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to delete own access group", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canDeleteAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "delete"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[1]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							ids: [accessGroupId],
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
						expect(qlRes.message).to.equal(
							"Cannot delete own access group!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should delete specified access groups", done => {
				const accessGroups = [
					{
						name: "canGetAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canDeleteAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "delete"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							ids: [accessGroupId],
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
						expect(response.body.data.accessGroup.delete).to.equal(
							"ok"
						);
					})
					.then(() => mongoose.model("AccessGroup").find({}))
					.then(accessGroups => {
						expect(accessGroups.length).to.equal(1);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("deletePermission", () => {
			const query = `
			mutation deleteGroupPermission(
			  	$_id:String = "",
			  	$permissionId: String = ""
			) {
			  	accessGroup {
			    	deletePermission(_id: $_id, permissionId: $permissionId) {
			      		_id
						name
						permissions {
							_id model endpoint
						}
			    	}
			  	}
			}`;

			it("should require user to be logged in", done => {
				const variables = {
					_id: mongoose.Types.ObjectId(),
					permissionId: mongoose.Types.ObjectId()
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

			it("should require target access group to exist", done => {
				const accessGroup = {
					name: "canDeleteAccessGroupPermission",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "deletePermission"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(accessGroup => {
						accessGroupId = accessGroup._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroup._id
							})
						);
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
							_id: mongoose.Types.ObjectId(),
							permissionId: mongoose.Types.ObjectId()
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

			it("should ensure user has accessGroup-deletePermission permission", done => {
				const accessGroup = {
					name: "canDeleteAccessGroup",
					permissions: [
						{
							model: "accessGroup",
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(accessGroup => {
						accessGroupId = accessGroup._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroup._id
							})
						);
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
							_id: accessGroupId,
							permissionId: mongoose.Types.ObjectId()
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

			it("should reject request to delete own permission", done => {
				const accessGroup = {
					name: "canDeleteAccessGroupPermission",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "deletePermission"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(accessGroup => {
						accessGroupId = accessGroup._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroup._id
							})
						);
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
							_id: accessGroupId,
							permissionId: mongoose.Types.ObjectId()
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
							"Cannot delete permission from own access group!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to delete admin's permission", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "delete"
							}
						]
					},
					{
						name: "canDeleteAccessGroupPermission",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "deletePermission"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							_id: accessGroupId,
							permissionId: mongoose.Types.ObjectId()
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
							"Cannot delete permission from admin access group!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should delete specified permissions", done => {
				const accessGroups = [
					{
						name: "canDeleteAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "delete"
							}
						]
					},
					{
						name: "canDeleteAccessGroupPermission",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "deletePermission"
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
				let accessGroupId, permissionId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						permissionId = accessGroups[0].permissions[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							_id: accessGroupId,
							permissionId
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
						expect(response.body.data.accessGroup).not.to.be
							.undefined;
						expect(response.body.data.accessGroup.deletePermission)
							.not.to.be.null;
						expect(
							response.body.data.accessGroup.deletePermission
								.permissions.length
						).to.equal(0);
						done();
					})
					.catch(helpers.logError(done));
			});
		});

		describe("update", () => {
			const query = `
			mutation updateGroup(
			  	$_id:String = "",
			  	$name:String = "",
			  	$permissions: [PermissionsInput] = []
			) {
			  	accessGroup {
			    	update(_id: $_id, name: $name, permissions: $permissions) {
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
					name: "new access group",
					_id: ""
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

			it("should ensure user has accessGroup-update permission", done => {
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
							name: "new name",
							_id: mongoose.Types.ObjectId()
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

			it("should require target access group to exist", done => {
				const accessGroup = {
					name: "canUpdateAccessGroup",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "update"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(accessGroup => {
						accessGroupId = accessGroup._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroup._id
							})
						);
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
							_id: mongoose.Types.ObjectId(),
							name: "newName"
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

			it("should reject request to update own permissions", done => {
				const accessGroup = {
					name: "canUpdateAccessGroup",
					permissions: [
						{
							model: "accessGroup",
							endpoint: "update"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.create(accessGroup)
					.then(accessGroup => {
						accessGroupId = accessGroup._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroup._id
							})
						);
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
							_id: accessGroupId,
							name: "newName"
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
							"Cannot modify own access group permissions!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should reject request to update admin's permissions", done => {
				const accessGroups = [
					{
						name: "admin",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "update"
							}
						]
					},
					{
						name: "canUpdateAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "update"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							_id: accessGroupId,
							name: "newName"
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
							"Cannot modify admin access group permissions!"
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should update specified access group", done => {
				const accessGroups = [
					{
						name: "canGetAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "get"
							}
						]
					},
					{
						name: "canUpdateAccessGroup",
						permissions: [
							{
								model: "accessGroup",
								endpoint: "update"
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
				let accessGroupId;
				mongoose
					.model("AccessGroup")
					.insertMany(accessGroups)
					.then(accessGroups => {
						accessGroupId = accessGroups[0]._id;
						return mongoose.model("User").create(
							Object.assign(user, {
								access: accessGroups[1]._id
							})
						);
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
							_id: accessGroupId,
							name: "newName",
							permissions: [
								{
									model: "accessGroup",
									endpoint: "get"
								},
								{
									model: "accessGroup",
									endpoint: "update"
								}
							]
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
						expect(response.body.data.accessGroup.update).not.to.be
							.null;
						expect(
							response.body.data.accessGroup.update.name
						).to.equal("newName");
						expect(
							response.body.data.accessGroup.update.permissions
								.length
						).to.equal(2);
						done();
					})
					.catch(helpers.logError(done));
			});
		});
	});
});
