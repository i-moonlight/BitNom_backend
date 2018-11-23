"use strict";

describe("accessGroup", () => {
	describe("query", () => {
		describe("get", () => {
			it("should require user to be logged in");
			it("should ensure user has accessGroup-get permission");
			it("should retrieve by provided _id");
			it("should retrive all is _id is not provided");
		});
	});

	describe("mutation", () => {
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
