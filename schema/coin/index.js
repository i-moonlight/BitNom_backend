"use strict";

const {
	GraphQLObjectType,
	GraphQLList,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLString
} = require("graphql");

const { paginationInput } = require("../input-types");

const coinInterface = require("./coin-interface");
const completeType = require("./complete-type");
const partialType = require("./partial-type");

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
		}
	})
});

module.exports = { coinQuery, completeType, partialType };
