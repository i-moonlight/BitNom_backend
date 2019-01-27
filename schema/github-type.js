"use strict";

const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

module.exports = new GraphQLObjectType({
	name: "Github",
	description: "The GitHub statistics of a coin.",
	fields() {
		return {
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
			issues: {
				type: GraphQLInt,
				description: "The issues made on the coin's repository."
			},
			pulls: {
				type: GraphQLInt,
				description:
					"The pull requests received by the coin's repository."
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
			link: {
				type: GraphQLString,
				description: "The absolute link to the coin's repository."
			}
		};
	}
});
