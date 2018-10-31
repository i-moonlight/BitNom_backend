"use strict";

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLNonNull
} = require("graphql");

const githubType = require("./github");
const coinInterface = require("./coin");

module.exports = new GraphQLObjectType({
	name: "Partial",
	description: "A cryptocurrency coin with some fields missing.",
	fields: () => ({
		_id: {
			type: GraphQLNonNull(GraphQLString),
			description: "The coin's auto-assigned database ID."
		},
		coinName: {
			type: GraphQLString,
			description: "The coin's name."
		},
		abbreviation: {
			type: GraphQLString,
			description: "The coin's abbreviation."
		},
		topicName: {
			type: GraphQLString,
			description: "The title of the topic announcing the coin."
		},
		topicLink: {
			type: GraphQLString,
			description: "The link to the topic announcing the coin."
		},
		githubLink: {
			type: GraphQLString,
			description: "The coin's github repository."
		},
		startedBy: {
			type: GraphQLString,
			description:
				"The username of the coin's announcement topic initiator."
		},
		profileLink: {
			type: GraphQLString,
			description: "The link to the topic's initiator's profile."
		},
		replies: {
			type: GraphQLString,
			description: "The number of replies made to the topic."
		},
		views: {
			type: GraphQLString,
			description: "The number of views the topic has received."
		},
		lastPostDate: {
			type: GraphQLString,
			description: "The last date on which a post was made on the topic."
		},
		announcementDate: {
			type: GraphQLString,
			description: "The date on which the topic was initiated."
		},
		github: {
			type: githubType,
			description: "The github statistics of the coin."
		}
	}),
	interfaces: [coinInterface]
});
