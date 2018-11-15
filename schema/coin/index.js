"use strict";

const {
	GraphQLObjectType,
	GraphQLList,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLString,
	GraphQLFloat
} = require("graphql");

const { paginationInput } = require("../input-types");

const coinInterface = require("./coin-interface");
const completeType = require("./complete-type");
const partialType = require("./partial-type");
const voteType = require("../vote-type");

const coinQuery = new GraphQLObjectType({
	name: "CoinQuery",
	description: "API to be used to fetch coin data.",
	fields: () => ({
		get: {
			type: GraphQLList(coinInterface),
			description: "Get coin data.",
			args: {
				_id: {
					type: GraphQLString,
					description: `An auto-assigned database ID.`
				},
				partial: {
					type: GraphQLBoolean,
					description: `Determines if the retieval is to be done from the
						completes or partials collection.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		},
		search: {
			type: GraphQLList(coinInterface),
			description: "Search for a given coin.",
			args: {
				searchString: {
					type: GraphQLString,
					description: `A user provided string to be used as the search key.`
				},
				partial: {
					type: GraphQLBoolean,
					description: `Determines if the retieval is to be done from the
						completes or partials collection.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		},
		votes: {
			type: GraphQLList(voteType),
			description:
				"A function to get the votes cast for a given coin or technology",
			args: {
				candidate: {
					type: GraphQLString,
					description:
						"The ID of the technology or coin whose votes are of interest."
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
	completeType,
	partialType,
	voteType
};
