"use strict";

const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLList
} = require("graphql");

const { paginationInput, technologyInput } = require("./input-types");
const voteType = require("./vote-type");

const technologyType = new GraphQLObjectType({
	name: "TechnologyType",
	description: "A blockchain technology",
	fields: () => ({
		_id: {
			type: GraphQLString,
			description: "An auto-assigned database ID."
		},
		logo: {
			type: GraphQLString,
			description: "The technology's logo."
		},
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
		},
		user: {
			type: GraphQLString,
			description: "The user who posted added the technology."
		},
		follows: {
			type: GraphQLInt,
			description:
				"The number of users subscribed to events in the technology."
		},
		date: {
			type: GraphQLString,
			description: "The date on which the technology was listed."
		}
	})
});

const technologyQuery = new GraphQLObjectType({
	name: "TechnologyQuery",
	description: "The API to get technologies' information.",
	fields: () => ({
		get: {
			type: GraphQLList(technologyType),
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of the target technology."
				},
				name: {
					type: GraphQLString,
					description: "The name of the target technology."
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		},
		search: {
			type: GraphQLList(technologyType),
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of an arbitrary user."
				},
				searchString: {
					type: GraphQLString,
					description: "The string to be used as the search key."
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		}
	}),
	types: [technologyType]
});

const technologyMutation = new GraphQLObjectType({
	name: "TechnologyMutation",
	description:
		"The API to create, update or delete technologies' information.",
	fields: () => ({
		create: {
			type: technologyType,
			description: "Used to create a listing for a new technology.",
			args: {
				technology: { type: GraphQLNonNull(technologyInput) }
			}
		},
		vote: {
			type: voteType,
			description: "Used to vote for a technology.",
			args: {
				candidate: {
					type: GraphQLString,
					description: "The ID of the technology being voted for."
				}
			}
		},
		delete: {
			type: GraphQLString,
			description:
				"Delete a list of technologies by specifying their IDs.",
			args: {
				ids: {
					type: GraphQLList(GraphQLString),
					description:
						"An array containing the IDs of the technologies to be deleted."
				}
			}
		},
		update: {
			type: technologyType,
			description: "Update a technology's information.",
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of the technology to be updated."
				},
				technology: {
					type: GraphQLNonNull(technologyInput),
					description: "The updated information on the technology."
				}
			}
		}
	}),
	types: [technologyType, voteType]
});

module.exports = { technologyType, technologyQuery, technologyMutation };
