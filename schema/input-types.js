"use strict";

const {
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
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

const technologyInput = new GraphQLInputObjectType({
	name: "TechnologyInput",
	description: "Input fields for a technology",
	fields: () => ({
		name: {
			type: GraphQLString,
			description: "The technology's name"
		},
		focus: {
			type: GraphQLString,
			description: "The area of focus of the technology."
		},
		description: {
			type: GraphQLString,
			description:
				"A brief description of the technology's aims and targeted solutions."
		},
		tags: {
			type: GraphQLList(GraphQLString),
			description: "Tags that can be associated with the technology."
		},
		features: {
			type: GraphQLList(GraphQLString),
			description: "Features available in the technology."
		},
		innovations: {
			type: GraphQLList(GraphQLString),
			description: "Innovations made by the technology."
		},
		repository: {
			type: GraphQLString,
			description: "The Git repository of the technology"
		},
		website: {
			type: GraphQLString,
			description: "The link to the technology's official website."
		}
	})
});

module.exports = { paginationInput, permissionsInput, technologyInput };
