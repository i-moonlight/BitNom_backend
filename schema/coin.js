"use strict";

const {
	GraphQLObjectType,
	GraphQLList,
	GraphQLID,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLFloat
} = require("graphql");

const { paginationInput } = require("./input-types");
const voteType = require("./vote-type");
const topicType = require("./topic-type");
const githubType = require("./github-type");

const coinType = new GraphQLObjectType({
	name: "CoinType",
	description: "A cryptocurrency coin data representation.",
	fields() {
		return {
			_id: {
				type: GraphQLNonNull(GraphQLID),
				description: "The coin's auto-assigned database ID."
			},
			name: {
				type: GraphQLString,
				description: "The coin's name."
			},
			abbreviation: {
				type: GraphQLString,
				description: "The coin's abbreviation."
			},
			topic: {
				type: topicType,
				description:
					"Information scraped from the associated" +
					" bitcointalk's topic page."
			},
			github: {
				type: githubType,
				description: "The github statistics of the coin."
			}
		};
	},
	types: [topicType, githubType]
});

const coinQuery = new GraphQLObjectType({
	name: "CoinQuery",
	description: "API to be used to fetch coin data.",
	fields: () => ({
		get: {
			type: GraphQLList(coinType),
			description: "Get coin data.",
			args: {
				_id: {
					type: GraphQLID,
					description: "An auto-assigned database ID."
				},
				partial: {
					type: GraphQLBoolean,
					description:
						"Specifies if the coin should contain empty fields."
				},
				pagination: {
					type: paginationInput,
					description:
						"Specifies the bounds of the data to be returned."
				}
			}
		},
		search: {
			type: GraphQLList(coinType),
			description: "Search for a given coin.",
			args: {
				searchString: {
					type: GraphQLString,
					description: "String to be used as the search key."
				},
				partial: {
					type: GraphQLBoolean,
					description:
						"Specifies if the coin should contain empty fields."
				},
				pagination: {
					type: paginationInput,
					description:
						"Specifies the bounds of the data to be returned."
				}
			}
		},
		votes: {
			type: GraphQLList(voteType),
			description: "Get the votes cast for candidate coin or technology",
			args: {
				candidate: {
					type: GraphQLID,
					description: "The ID of the target technology or coin."
				}
			}
		}
	})
});

const coinMutation = new GraphQLObjectType({
	name: "CoinMutation",
	description: "Functions to create, update and delete coin information.",
	fields: () => ({
		vote: {
			type: voteType,
			description: "Cast a vote for a technology or coin.",
			args: {
				invoiceId: {
					type: GraphQLString,
					description:
						"The ID of the invoice used to make the donation."
				},
				user: {
					type: GraphQLString,
					description: "An ID identifying the donating user."
				},
				candidate: {
					type: GraphQLString,
					description:
						"The ID of the technology or coin being voted on."
				},
				amount: {
					type: GraphQLFloat,
					description: "The amount in Satoshis of the donation."
				}
			}
		}
	})
});

module.exports = {
	coinQuery,
	coinMutation,
	coinType
};
