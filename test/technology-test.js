"use strict";

describe("technology", () => {
	describe("query", () => {
		describe("get", () => {
			it("should retrieve using provided _id");
			it("should return all if _id is not provided");
		});

		describe("search", () => {
			it("should return matching entries");
		});
	});

	describe("mutation", () => {
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
