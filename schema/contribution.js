"use strict";

const {
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType
} = require("graphql");

const resourceType = new GraphQLObjectType({
	name: "ResourceType",
	description: "Provides minimal details for a resource.",
	fields: () => ({
		_id: {
			type: GraphQLID,
			description: "The ID of the resource."
		},
		name: {
			type: GraphQLString,
			description: "The name associated with the resource."
		}
	})
});

const contributionType = new GraphQLObjectType({
	name: "ContributionType",
	description: "A representation of a user's contributions.",
	fields: () => ({
		_id: {
			type: GraphQLID,
			description: "The ID of the associated thread."
		},
		type: {
			type: GraphQLString,
			description: "The type of thread [coin-thread|technology-thread]."
		},
		title: {
			type: GraphQLString,
			description: "The title associated with the thread."
		},
		resource: { type: resourceType },
		contributions: {
			type: GraphQLInt,
			description: "The contributions obtained per thread."
		}
	}),
	types: [resourceType]
});

const contributionQuery = new GraphQLObjectType({
	name: "ContributionQuery",
	description: "APIs to query a user's contributions.",
	fields: () => ({
		get: {
			type: GraphQLList(contributionType),
			description: "Get the logged in user's contributions."
		}
	})
});

module.exports = { resourceType, contributionType, contributionQuery };
