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
const { userType } = require("./user");

const resourceMessageType = new GraphQLObjectType({
	name: "ResourceMessageType",
	description: "Representation of a resource message.",
	fields: () => ({
		_id: {
			type: GraphQLID,
			description: "ID of the message."
		},
		user: {
			type: userType,
			description: "A snapshot of the user who posted the message."
		},
		resource: {
			type: GraphQLID,
			description: "ID of the corresponding resource."
		},
		parentMessage: {
			type: GraphQLID,
			description:
				"ID of the parent message if the message is a nested message."
		},
		text: {
			type: GraphQLString,
			description: "The message body."
		},
		date: {
			type: GraphQLString,
			description: "Message creation date."
		}
	})
});

const resourceMessageQuery = new GraphQLObjectType({
	name: "ResourceMessageQuery",
	description: "API to be used to fetch resource messages.",
	fields: () => ({
		get: {
			type: GraphQLList(resourceMessageType),
			description: "Get resource messages.",
			args: {
				resource: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the corresponding resource."
				},
				pagination: {
					type: paginationInput,
					description:
						"Specifies the bounds of the data to be returned."
				}
			}
		}
	})
});

const resourceMessageMutation = new GraphQLObjectType({
	name: "ResourceMessageMutation",
	description: "Functions to create resource messages.",
	fields: () => ({
		create: {
			type: resourceMessageType,
			description: "Create a message",
			args: {
				resource: {
					type: GraphQLNonNull(GraphQLID),
					description: "ID of the target resource."
				},
				parentMessage: {
					type: GraphQLID,
					description:
						"ID of the parent message, if the message is a response."
				},
				text: {
					type: GraphQLNonNull(GraphQLString),
					description: "The message body."
				}
			}
		}
	})
});

module.exports = {
	resourceMessageQuery,
	resourceMessageMutation,
	resourceMessageType
};
