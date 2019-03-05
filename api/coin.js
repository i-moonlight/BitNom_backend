"use strict";

const superagent = require("superagent");
const mongoose = require("mongoose");
const config = require("../config");

const githubToken = process.env.GITHUB_TOKEN || config.githubToken;

function getRepoOwnerAndName(gitUrl) {
	return new URL(gitUrl).pathname
		.split("/")
		.filter(val => val !== "")
		.slice(0, 2);
}

function updateCoinsDetails(coins) {
	const query = `
	query($owner: String!, $name: String!) {
		repository(owner: $owner, name: $name) {
			forkCount createdAt descriptionHTML isFork isPrivate isArchived
			pushedAt shortDescriptionHTML
			releases { totalCount }
			stargazers { totalCount }
			watchers { totalCount }
			primaryLanguage { name color }
			languages(first: 0) { nodes { name color }}
			openIssues: issues(states: [OPEN]) { totalCount }
		    closedIssues: issues(states: [CLOSED]) { totalCount }
		    openPullRequests: pullRequests(states: [OPEN]) { totalCount }
		    closedPullRequests: pullRequests(states: [CLOSED]) { totalCount }
		    openProjects: projects(states: [OPEN]) { totalCount }
		    closedProjects: projects(states: [CLOSED]) { totalCount }
		}
	}
	`;
	coins.reduce((acc, coin) => {
		// do not update coins that were updated less than 24 hrs ago
		if (
			coin.github.updateTime &&
			new Date() - coin.github.updateTime < 86400000
		)
			return acc;
		// skip all coins without github links
		if (!coin.github.link) return acc;
		// skip urls for which an owner and repository name could not be extracted
		const [owner, name] = getRepoOwnerAndName(coin.github.link);
		if (!owner || !name) return acc;
		// queue an update for the current coin
		return (
			acc
				.then(() =>
					superagent
						.post("https://api.github.com/graphql")
						.set("Authorization", `Bearer ${githubToken}`)
						.send({ query, variables: { owner, name } })
						.then(({ body }) => body)
						.then(({ data, errors }) => {
							if (errors && errors.length !== 0) {
								console.log(errors);
								return;
							}
							coin.github.updateTime = new Date();
							coin.github.shortDescription =
								data.repository.shortDescriptionHTML;
							coin.github.description =
								data.repository.descriptionHTML;
							if (coin.github.primaryLanguage) {
								coin.github.primaryLanguage.name =
									data.repository.primaryLanguage.name;
								coin.github.primaryLanguage.color =
									data.repository.primaryLanguage.color;
							}
							coin.github.languages =
								data.repository.languages.nodes;
							coin.github.createdAt = data.repository.createdAt;
							coin.github.pushedAt = data.repository.pushedAt;
							coin.github.isFork = data.repository.isFork;
							coin.github.isArchived = data.repository.isArchived;
							coin.github.isPrivate = data.repository.isArchived;
							coin.github.dynamic.push({
								watch: data.repository.watchers.totalCount,
								stars: data.repository.stargazers.totalCount,
								forks: data.repository.forkCount,
								openIssues:
									data.repository.openIssues.totalCount,
								closedIssues:
									data.repository.closedIssues.totalCount,
								openPullRequests:
									data.repository.openPullRequests.totalCount,
								closedPullRequests:
									data.repository.closedPullRequests
										.totalCount,
								// commits: data.repository.commits.totalCount,
								openProjects:
									data.repository.openProjects.totalCount,
								closedProjects:
									data.repository.closedProjects.totalCount,
								releases: data.repository.releases.totalCount,
								date: new Date()
							});
							return coin.save();
						})
						.catch(error => console.log(error))
				)
				// delay a few microseconds before updating the next coin.
				.then(
					() =>
						new Promise((resolve, reject) => {
							setTimeout(resolve, 500);
						})
				)
		);
	}, Promise.resolve());
}

module.exports = {
	get({ _id, partial, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (!_id && partial === false)
			params = {
				name: { $ne: "" },
				abbreviation: { $ne: "" },
				"github.link": { $ne: "" }
			};
		pagination = pagination || {};
		return mongoose
			.model("Coin")
			.find(params)
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0)
			.then(coins => {
				updateCoinsDetails(coins);
				return coins;
			});
	},
	search({ searchString, partial, pagination }) {
		pagination = pagination || {};
		return mongoose
			.model("Coin")
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0);
	},
	count({ partial }) {
		let params = {};
		if (partial === false)
			params = {
				name: { $ne: "" },
				abbreviation: { $ne: "" },
				"github.link": { $ne: "" }
			};
		return mongoose.model("Coin").countDocuments(params);
	},
	vote({ invoiceId, user, candidate, amount }) {
		return mongoose
			.model("Vote")
			.create({ invoiceId, user, candidate, amount, date: new Date() });
	},
	votes({ candidate }) {
		return mongoose.model("Vote").find({ candidate });
	}
};
