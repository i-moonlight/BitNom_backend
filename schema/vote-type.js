"use strict";

const { GraphQLObjectType, GraphQLString, GraphQLFloat } = require("graphql");

module.exports = new GraphQLObjectType({
	name: "VoteType",
	description: "The representation of a vote cast for a technology or coin.",
	fields: () => ({
		_id: {
			type: GraphQLString,
			description: "An auto-assigned database ID."
		},
		invoiceId: {
			type: GraphQLString,
			description: "The ID of the invoice used to make the donation."
		},
		user: {
			type: GraphQLString,
			description: "An ID identifying the donating user."
		},
		candidate: {
			type: GraphQLString,
			description: "The ID of the technology or coin being voted on."
		},
		amount: {
			type: GraphQLFloat,
			description: "The amount in Satoshis of the donation."
		},
		date: {
			type: GraphQLString,
			description: "The date on which the vote was cast."
		}
	})
});
