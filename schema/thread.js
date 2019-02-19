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

const { paginationInput, threadInput } = require("./input-types");

const threadType = new GraphQLObjectType({
	name: "ThreadType",
	description: "A thread entry representation.",
	fields() {
		return {
			_id: {
				type: GraphQLNonNull(GraphQLID),
				description: "The thread's auto-assigned database ID."
			},
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
				description:
					"The source code snippets associated with a thread."
			},
			user: {
				type: GraphQLString,
				description: "The user who created the thread."
			},
			date: {
				type: GraphQLString,
				description: "The thread's creation date."
			},
			resource: {
				type: GraphQLString,
				description: "Resource to which the thread belongs to."
			}
		};
	}
});

const threadQuery = new GraphQLObjectType({
	name: "ThreadQuery",
	description: "API to be used to fetch threads' data.",
	fields: () => ({
		get: {
			type: GraphQLList(threadType),
			description: "Get threads' data.",
			args: {
				_id: {
					type: GraphQLID,
					description: "An auto-assigned database ID."
				},
				category: {
					type: GraphQLString,
					description: "The topic's category."
				},
				user: {
					type: GraphQLID,
					description: "The ID of the user who created the thread."
				},
				resource: {
					type: GraphQLID,
					description:
						"The ID of the resource to which the thread belongs to."
				},
				pagination: {
					type: paginationInput,
					description:
						"Specifies the bounds of the data to be returned."
				}
			}
		},
		count: {
			type: GraphQLInt,
			description: "The number of threads.",
			args: {
				category: {
					type: GraphQLString,
					description: "The topic's category."
				},
				user: {
					type: GraphQLID,
					description: "The ID of the user who created the thread."
				},
				resource: {
					type: GraphQLID,
					description:
						"The ID of the resource to which the thread belongs to."
				}
			}
		},
		search: {
			type: GraphQLList(threadType),
			description: "Search for a given thread.",
			args: {
				searchString: {
					type: GraphQLString,
					description: "String to be used as the search key."
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

const threadMutation = new GraphQLObjectType({
	name: "ThreadMutation",
	description: "Functions to create, update and delete thread information.",
	fields: () => ({
		create: {
			type: threadType,
			description: "Create a thread",
			args: {
				thread: { type: GraphQLNonNull(threadInput) }
			}
		},
		update: {
			type: threadType,
			description: "Create a thread",
			args: {
				_id: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the thread to be updated."
				},
				thread: { type: GraphQLNonNull(threadInput) }
			}
		},
		delete: {
			type: threadType,
			description: "Create a thread",
			args: {
				_id: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the thread to be updated."
				}
			}
		}
	})
});

module.exports = {
	threadQuery,
	threadMutation,
	threadType
};
