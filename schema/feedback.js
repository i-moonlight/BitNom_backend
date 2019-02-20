"use strict";

const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt
} = require("graphql");

const FeedbackType = new GraphQLObjectType({
	name: "Feedback",
	description: "The feedback associated with a resource.",
	fields: () => ({
		upvotes: {
			type: GraphQLInt,
			description: "The received upvotes."
		},
		downvotes: {
			type: GraphQLInt,
			description: "The received downvotes."
		},
		flags: {
			type: GraphQLInt,
			description: "The received flags."
		}
	})
});

const feedbackQuery = new GraphQLObjectType({
	name: "FeedbackQuery",
	description: "API for getting user feedback for a resource.",
	fields: () => ({
		get: {
			type: FeedbackType,
			description: "Get feedback.",
			args: {
				resource: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the target resource."
				}
			}
		}
	})
});

const feedbackMutation = new GraphQLObjectType({
	name: "FeedbackMutation",
	description: "API to create and update user feedback.",
	fields: () => ({
		respond: {
			type: GraphQLBoolean,
			description: "Create or update a feedback",
			args: {
				resource: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the target resource."
				},
				type: {
					type: GraphQLNonNull(GraphQLString),
					description: "The type of feedback [upvote|downvote|flag]."
				}
			}
		}
	})
});

module.exports = {
	feedbackQuery,
	feedbackMutation,
	FeedbackType
};
