"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

describe("coin", () => {
	describe("query", () => {
		beforeEach(done => {
			mongoose
				.model("Partial")
				.deleteMany({})
				.then(() => mongoose.model("Complete").deleteMany({}))
				.then(() => done())
				.catch(done);
		});

		let coins = [
			{
				coinName: "Coin",
				abbreviation: "CXN",
				topicName: "All about Coin",
				topicLink: "http://to.coin.com",
				githubLink: "http://github.com/coin",
				startedBy: "starter",
				profileLink: "http://profile.com/starter",
				replies: 2000,
				views: 300,
				lastPostDate: new Date(),
				announcementDate: new Date(),
				github: {
					watch: 20,
					stars: 5,
					forks: 1,
					issues: 16,
					pulls: 38,
					commits: 246,
					branches: 1,
					releases: 2,
					contributors: 1,
					repository: "http://github.com/coin.git"
				}
			},
			{
				coinName: "ZenCoin",
				abbreviation: "ZNC",
				topicName: "All about ZenCoin",
				topicLink: "http://zencoin.com",
				githubLink: "http://github.com/zencoin",
				startedBy: "bystander",
				profileLink: "http://profile.com/bystander",
				replies: 2000,
				views: 300,
				lastPostDate: new Date(),
				announcementDate: new Date(),
				github: {
					watch: 20,
					stars: 5,
					forks: 1,
					issues: 16,
					pulls: 38,
					commits: 246,
					branches: 1,
					releases: 2,
					contributors: 1,
					repository: "http://github.com/zencoin.git"
				}
			}
		];

		beforeEach(done => {
			mongoose
				.model("Partial")
				.insertMany(coins)
				.then(partialCoins => {
					return mongoose
						.model("Complete")
						.insertMany(coins)
						.then(completeCoins => {
							coins = partialCoins.concat(completeCoins);
						});
				})
				.then(() => done())
				.catch(done);
		});

		describe("get", () => {
			const query = `
			query getCoin(
				$_id: String = "",
				$partial: Boolean = false,
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				coin {
					get(_id: $_id, partial: $partial, pagination: $pagination) {
						_id coinName abbreviation topicName topicLink githubLink
						startedBy profileLink replies views lastPostDate
						announcementDate
						github {
							watch stars forks issues pulls commits branches releases
							contributors repository
						}
					}
				}
			}`;

			it("should retrieve by provided _id", done => {
				const variables = {
					_id: coins[0]._id,
					partial: true
				};
				helpers
					.runQuery({ query, variables }, null, done)
					.then(response => {
						expect(response).not.to.be.undefined;
						expect(response.body.data).not.to.be.undefined;
						expect(response.body.data.coin).not.to.be.undefined;
						expect(response.body.data.coin.get).not.to.be.null;
						expect(response.body.data.coin.get.length).to.equal(1);
						expect(response.body.data.coin.get[0]._id).to.equal(
							String(coins[0]._id)
						);
						done();
					})
					.catch(helpers.logError(done));
			});

			it("should retrieve all if _id is not provided");
		});

		describe("search", () => {
			it("should retrieve matching entries only");
		});

		describe("votes", () => {
			it("should return votes for coin");
		});
	});

	describe("mutation", () => {
		describe("vote", () => {});
	});
});
