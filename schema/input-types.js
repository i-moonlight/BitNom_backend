"use strict";

const {
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
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
		model: {
			type: GraphQLNonNull(GraphQLString),
			description: `The name of a given collection e.g. user, technology etc.`
		},
		endpoint: {
			type: GraphQLNonNull(GraphQLString),
			description: `The name of a given schema function e.g create, technology etc.`
		},
		owned: {
			type: GraphQLBoolean,
			description: `A boolean determining if the owned constraint is to be applied on
				a given request.`,
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

const threadInput = new GraphQLInputObjectType({
	name: "ThreadInput",
	description: "Input fields for a technology",
	fields: () => ({
		title: {
			type: GraphQLString,
			description: "The thread's title."
		},
		description: {
			type: GraphQLString,
			description: "The thread's description."
		},
		category: {
			type: GraphQLString,
			description:
				"The category under which the thread is classified (feature|srccode|other)."
		},
		srccodes: {
			type: GraphQLList(GraphQLString),
			description: "The source code snippets associated with a thread."
		},
		resource: {
			type: GraphQLID,
			description:
				"The ID of the resource to which the thread belongs to."
		}
	})
});

module.exports = {
	paginationInput,
	permissionsInput,
	technologyInput,
	threadInput
};
