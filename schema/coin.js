"use strict";

const {
	GraphQLInterfaceType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLNonNull
} = require("graphql");

const githubType = require("./github");

function hasEmptyField(obj) {
	if (!obj) return true;
	Object.keys(obj).map(key => {
		let val = obj[key];
		if (val === "" || val === null || val === undefined) {
			return true;
		}
	});
	return false;
}

module.exports = new GraphQLInterfaceType({
	name: "Coin",
	description: "A cryptocurrency coin",
	fields: {
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
	},
	resolveType(coin) {
		coin = coin.toObject();
		if (hasEmptyField(coin) || hasEmptyField(coin.github)) {
			return require("./partial");
		}
		return require("./complete");
	}
});
