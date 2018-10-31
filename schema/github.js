"use strict";

const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

module.exports = new GraphQLObjectType({
	name: "Github",
	description: "The GitHub statistics of a coin.",
	fields() {
		return {
			watch: {
				type: GraphQLString,
				description: "The watches received by the coin's repository."
			},
			stars: {
				type: GraphQLString,
				description: "The stars received by the coin's repository."
			},
			forks: {
				type: GraphQLString,
				description: "The forks received by the coin's repository."
			},
			issues: {
				type: GraphQLString,
				description: "The issues made on the coin's repository."
			},
			pulls: {
				type: GraphQLString,
				description:
					"The pull requests received by the coin's repository."
			},
			commits: {
				type: GraphQLString,
				description: "The commits made to the coin's repository."
			},
			branches: {
				type: GraphQLString,
				description: "The branches on the coin's repository."
			},
			releases: {
				type: GraphQLString,
				description: "The releases on the coin's repository."
			},
			contributors: {
				type: GraphQLString,
				description: "The contributers to the coin's repository."
			},
			repository: {
				type: GraphQLString,
				description: "The absolute link to the coin's repository."
			}
		};
	}
});
