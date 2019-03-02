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

const messageType = new GraphQLObjectType({
	name: "MessageType",
	description: "Representation of a message.",
	fields: () => ({
		_id: {
			type: GraphQLID,
			description: "ID of the message."
		},
		sender: {
			type: GraphQLID,
			description: "ID of the sender."
		},
		recipient: {
			type: GraphQLID,
			description: "ID of the recepient."
		},
		text: {
			type: GraphQLString,
			description: "The message body."
		},
		date: {
			type: GraphQLString,
			description: "Message creation date."
		},
		read: {
			type: GraphQLBoolean,
			description: "Read status."
		}
	})
});

const messagePerUserType = new GraphQLObjectType({
	name: "MessagesPerUser",
	description: "The number of unread messages from each user.",
	fields: () => ({
		sender: {
			type: userType,
			description: "The message sender."
		},
		count: {
			type: GraphQLInt,
			description: "The number of unread messages from the user."
		},
		date: {
			type: GraphQLString,
			description: "The date of the last received message."
		}
	})
});

const messageQuery = new GraphQLObjectType({
	name: "MessageQuery",
	description: "API to be used to fetch messages.",
	fields: () => ({
		get: {
			type: GraphQLList(messageType),
			description: "Get messages.",
			args: {
				sender: {
					type: GraphQLNonNull(GraphQLID),
					description: "The ID of the user who sent the message."
				},
				pagination: {
					type: paginationInput,
					description:
						"Specifies the bounds of the data to be returned."
				}
			}
		},
		unreadPerUser: {
			description: "The number of unread messages from each user",
			type: GraphQLList(messagePerUserType)
		}
	})
});

const messageMutation = new GraphQLObjectType({
	name: "MessageMutation",
	description: "Functions to create, update and delete messages.",
	fields: () => ({
		create: {
			type: messageType,
			description: "Create a message",
			args: {
				recipient: {
					type: GraphQLID,
					description: "ID of the recepient."
				},
				text: {
					type: GraphQLString,
					description: "The message body."
				}
			}
		},
		delete: {
			type: messageType,
			description: "Create a thread",
			args: {
				_id: {
					type: GraphQLNonNull(GraphQLID),
					description: "Delete a message."
				}
			}
		}
	})
});

module.exports = {
	messageQuery,
	messageMutation,
	messageType
};
