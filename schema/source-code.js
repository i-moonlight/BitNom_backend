"use strict";

const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLBoolean
} = require("graphql");

const { paginationInput } = require("./input-types");

const sourceCodeType = new GraphQLObjectType({
	name: "SourceCodeType",
	description: `
		Feature and innovations lists for a coin/technology and their corresponding
		code snippets.`,
	fields: () => ({
		_id: {
			type: GraphQLString,
			description: `An auto-assigned database ID.`
		},
		description: {
			type: GraphQLString,
			description: `A description of the feature or innovation.`
		},
		code: {
			type: GraphQLString,
			description: `The feature's/innovation's corresponding code snippet.`
		},
		target: {
			type: GraphQLString,
			description: `The implementing coin/technology.`
		},
		user: {
			type: GraphQLString,
			description: `The user who creates the entry.`
		},
		date: {
			type: GraphQLString,
			description: `The entry date.`
		}
	})
});

const sourceCodeQuery = new GraphQLObjectType({
	name: "SourceCodeQuery",
	description: `
		The API for accessing a coin's/technology's  information.`,
	fields: () => ({
		get: {
			type: GraphQLList(sourceCodeType),
			description: `Get source code entries.`,
			args: {
				_id: {
					type: GraphQLString,
					description: `
						The auto-assigned database ID associated with the entry.`
				},
				target: {
					type: GraphQLString,
					description: `
						The auto-assigned database ID of the target.`
				},
				user: {
					type: GraphQLString,
					description: `
						The auto-assigned database ID of a user.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		},
		search: {
			type: GraphQLList(sourceCodeType),
			description: `Search the source code entries.`,
			args: {
				searchString: {
					type: GraphQLString,
					description: `The string to use as a search parameter.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		}
	}),
	types: [sourceCodeType]
});

const sourceCodeMutation = new GraphQLObjectType({
	name: "SourceCodeMutation",
	description:
		"The API for creating, modifying and deleting source code entries.",
	fields: () => ({
		create: {
			type: sourceCodeType,
			description: `Create a new source code entry.`,
			args: {
				target: {
					type: GraphQLString,
					description: `The ID of the implementing technology/coin.`
				},
				description: {
					type: GraphQLString,
					description: `A description of the feature/innovation.`
				},
				code: {
					type: GraphQLString,
					description: `The code implementing the feature/innovation.`
				}
			}
		},
		delete: {
			type: GraphQLList(GraphQLString),
			description: "Delete source code entries by specifying their IDs.",
			args: {
				ids: {
					type: GraphQLList(GraphQLString),
					description: `
						An array containing the IDs of the source code entries
						to be deleted.`
				}
			}
		},
		update: {
			type: sourceCodeType,
			description: "Update the particulars of a source code entry.",
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of the target source code entry."
				},
				description: {
					type: GraphQLString,
					description: `A description of the feature/innovation.`
				},
				code: {
					type: GraphQLString,
					description: `The code implementing the feature/innovation.`
				}
			}
		}
	}),
	types: [sourceCodeType]
});

module.exports = { sourceCodeType, sourceCodeQuery, sourceCodeMutation };
