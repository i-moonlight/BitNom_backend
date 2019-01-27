"use strict";

const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
	name: "Topic",
	description:
		"Representation for data collected from a bitcoin talk " +
		"announcement detail view.",
	fields() {
		return {
			title: {
				type: GraphQLString,
				description: "The title of the scraped topic."
			},
			link: {
				type: GraphQLString,
				description: "The link of the scraped topic."
			},
			startedBy: {
				type: new GraphQLObjectType({
					name: "BitcointalkUser",
					description: "Bitcointalk user details",
					fields: () => ({
						username: {
							type: GraphQLString,
							description: "The user's username."
						},
						profile: {
							type: GraphQLString,
							description: "The link to the user's profile."
						}
					})
				})
			},
			replies: {
				type: GraphQLList(
					new GraphQLObjectType({
						name: "BitcointalkReplies",
						description:
							"Topics' number of replies as appears at daily logging time",
						fields: () => ({
							_id: {
								type: GraphQLNonNull(GraphQLID),
								description:
									"The entry's auto-assigned database ID."
							},
							no: {
								type: GraphQLInt,
								description: "The number of replies."
							},
							date: {
								type: GraphQLString,
								description: "The time of logging the replies."
							}
						})
					})
				)
			},
			views: {
				type: GraphQLList(
					new GraphQLObjectType({
						name: "BitcointalkViews",
						description:
							"Topics' number of views as appears at daily logging time",
						fields: () => ({
							_id: {
								type: GraphQLNonNull(GraphQLID),
								description:
									"The entry's auto-assigned database ID."
							},
							no: {
								type: GraphQLInt,
								description: "The number of views."
							},
							date: {
								type: GraphQLString,
								description: "The time of logging the views."
							}
						})
					})
				)
			},
			lastPostDate: {
				type: GraphQLString,
				description:
					"The last date on which a comment was posted on the topic's page."
			},
			announcementDate: {
				type: GraphQLString,
				description: "The date on which the topic was created."
			},
			githubLinks: {
				type: new GraphQLList(GraphQLString),
				description: "The github links appearing on the topic's page."
			},
			parsed: {
				type: GraphQLBoolean,
				description:
					"Indicates if the topic's page has been scraped or not."
			}
		};
	}
});
