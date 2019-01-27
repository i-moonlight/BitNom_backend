"use strict";

const mongoose = require("mongoose");
const { expect } = require("chai");

const helpers = require("./test-helpers");

describe("coin", () => {
	describe("query", () => {
		let coins = [
			{
				name: "Coin",
				abbreviation: "CXN",
				topic: {
					title: "All about Coin",
					link: "http://to.coin.com",
					githubLinks: ["http://github.com/coin"],
					startedBy: {
						username: "starter",
						profile: "http://profile.com/starter"
					},
					replies: [{ no: 2000, date: new Date() }],
					views: [{ no: 300, date: new Date() }],
					lastPostDate: new Date(),
					announcementDate: new Date()
				},
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
					link: "http://github.com/coin.git"
				}
			},
			{
				name: "ZenCoin",
				abbreviation: "ZNC",
				topic: {
					title: "All about ZenCoin",
					link: "http://zencoin.com",
					githubLinks: ["http://github.com/zencoin"],
					startedBy: {
						username: "bystander",
						profile: "http://profile.com/bystander"
					},
					replies: [{ no: 2000, date: new Date() }],
					views: [{ no: 300, date: new Date() }],
					lastPostDate: new Date(),
					announcementDate: new Date()
				},
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
				.model("Coin")
				.deleteMany({})
				.then(() => mongoose.model("Coin").insertMany(coins))
				.then(savedCoins => (coins = savedCoins))
				.then(() => done())
				.catch(done);
		});

		describe("get", () => {
			const query = `
			query getCoin(
				$_id: ID = "",
				$partial: Boolean = false,
				$pagination: PaginationInput = {
					limit: 20,
					skip: 0
				}
			) {
				coin {
					get(_id: $_id, partial: $partial, pagination: $pagination) {
						_id name abbreviation topic {
							title link githubLinks startedBy {
								username
								profile
							}
							replies { _id no date }
							views { _id no date }
							lastPostDate announcementDate
						}
						github {
							watch stars forks issues pulls commits branches releases
							contributors link
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
