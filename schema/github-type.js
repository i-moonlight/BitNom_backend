"use strict";

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} = require("graphql");

const programmingLanguageType = new GraphQLObjectType({
	name: "ProgrammingLanguage",
	description: "A programming language representation.",
	fields: () => ({
		name: {
			type: GraphQLString,
			description: "The name of the programming language."
		},
		color: {
			type: GraphQLString,
			description: "The color assossiated with the programming language."
		}
	})
});

const githubDynamicType = new GraphQLObjectType({
	name: "GithubDynamic",
	description: "Represents time stamped values of GitHub data.",
	fields: () => ({
		watch: {
			type: GraphQLInt,
			description: "The watches received by the coin's repository."
		},
		stars: {
			type: GraphQLInt,
			description: "The stars received by the coin's repository."
		},
		forks: {
			type: GraphQLInt,
			description: "The forks received by the coin's repository."
		},
		openIssues: {
			type: GraphQLInt,
			description: "The open issues on the coin's repository."
		},
		closedIssues: {
			type: GraphQLInt,
			description: "The closed issues on the coin's repository."
		},
		openPullRequests: {
			type: GraphQLInt,
			description: "The open pull requests on the coin's repository."
		},
		closedPullRequests: {
			type: GraphQLInt,
			description: "The closed pull requests on the coin's repository."
		},
		openProjects: {
			type: GraphQLInt,
			description: "The open projects on the coin's repository."
		},
		closedProjects: {
			type: GraphQLInt,
			description: "The closed projects on the coin's repository."
		},
		commits: {
			type: GraphQLInt,
			description: "The commits made to the coin's repository."
		},
		branches: {
			type: GraphQLInt,
			description: "The branches on the coin's repository."
		},
		releases: {
			type: GraphQLInt,
			description: "The releases on the coin's repository."
		},
		contributors: {
			type: GraphQLInt,
			description: "The contributers to the coin's repository."
		},
		date: {
			type: GraphQLString,
			description: "The collection date of the assossiated data."
		}
	})
});

const githubType = new GraphQLObjectType({
	name: "Github",
	description: "The GitHub statistics of a coin.",
	fields() {
		return {
			link: {
				type: GraphQLString,
				description: "The absolute link to the coin's repository."
			},
			shortDescription: {
				type: GraphQLString,
				description: "A short description of the coin's repository."
			},
			description: {
				type: GraphQLString,
				description: "The coin's repository description."
			},
			updateTime: {
				type: GraphQLString,
				description: "The last update time for the github data."
			},
			primaryLanguage: {
				type: programmingLanguageType,
				description:
					"The most used programming language in the coin's repository."
			},
			languages: {
				type: GraphQLList(programmingLanguageType),
				description:
					"Other programming languages used within the coin's repository."
			},
			createdAt: {
				type: GraphQLString,
				description: "The repository's creation date."
			},
			pushedAt: {
				type: GraphQLString,
				description:
					"The last date on which there was a push to the repository."
			},
			isFork: {
				type: GraphQLBoolean,
				description: "Indicates if the repository is a fork."
			},
			isArchived: {
				type: GraphQLBoolean,
				description: "Indicates if the repository is archived."
			},
			isPrivate: {
				type: GraphQLBoolean,
				description: "Indicates if the repository is private."
			},
			dynamic: { type: GraphQLList(githubDynamicType) }
		};
	},
	types: [programmingLanguageType, githubDynamicType]
});

module.exports = { githubType, programmingLanguageType, githubDynamicType };
