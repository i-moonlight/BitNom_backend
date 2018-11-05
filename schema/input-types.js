"use strict";

const {
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLNonNull
} = require("graphql");

const paginationInput = new GraphQLInputObjectType({
	name: "PaginationInput",
	description: "Used to set the fetch request's page size and offset.",
	fields: () => ({
		limit: {
			type: GraphQLInt,
			description: "Sets the page's size.",
			defaultValue: 20
		},
		skip: {
			type: GraphQLInt,
			description: "Sets the page's offset.",
			defaultValue: 0
		}
	})
});

const permissionsInput = new GraphQLInputObjectType({
	name: "PermissionsInput",
	description: `An entry defining a group's permissions on a given
					collection.`,
	fields: () => ({
		name: {
			type: GraphQLNonNull(GraphQLString),
			description: `The name of a given collection.`
		},
		create: {
			type: GraphQLBoolean,
			description: `The group's create permissions on the collection.`,
			defaultValue: false
		},
		read: {
			type: GraphQLBoolean,
			description: `The group's read permissions on the collection.`,
			defaultValue: false
		},
		update: {
			type: GraphQLBoolean,
			description: `The group's update permissions on the collection.`,
			defaultValue: false
		},
		delete: {
			type: GraphQLBoolean,
			description: `The group's delete permissions on the collection.`,
			defaultValue: false
		}
	})
});

module.exports = { paginationInput, permissionsInput };
