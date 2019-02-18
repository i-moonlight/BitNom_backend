"use strict";

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLBoolean
} = require("graphql");

require("../models")();
const {
	Coin,
	User,
	login,
	AccessGroup,
	Technology,
	TechnologyThread,
	CoinThread
} = require("../api");

const { coinQuery, coinMutation } = require("./coin");
const { userQuery, userMutation } = require("./user");
const { technologyQuery, technologyMutation } = require("./technology");
const { accessGroupQuery, accessGroupMutation } = require("./access-group");
const { threadQuery, threadMutation } = require("./thread");
const schemaEndpoints = require("./schema-endpoints");

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQueryType",
		fields: {
			schemaEndpoints: {
				type: GraphQLString,
				resolve: () => JSON.stringify(schemaEndpoints)
			},
			accessGroup: {
				type: accessGroupQuery,
				resolve: () => AccessGroup
			},
			user: {
				type: userQuery,
				resolve: () => User
			},
			coin: {
				type: coinQuery,
				resolve: () => Coin
			},
			technology: {
				type: technologyQuery,
				resolve: () => Technology
			},
			technologyThread: {
				type: threadQuery,
				resolve: () => TechnologyThread
			},
			coinThread: {
				type: threadQuery,
				resolve: () => CoinThread
			},
			login: {
				type: GraphQLString,
				args: {
					email: {
						type: GraphQLNonNull(GraphQLString),
						description: "A user provided email."
					},
					password: {
						type: GraphQLNonNull(GraphQLString),
						description: "The user's password."
					}
				},
				resolve: (root, { email, password }) => {
					return login({ email, password });
				}
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: "RootMutationType",
		fields: {
			accessGroup: {
				type: accessGroupMutation,
				resolve: () => AccessGroup
			},
			user: {
				type: userMutation,
				resolve: () => User
			},
			technology: {
				type: technologyMutation,
				resolve: () => Technology
			},
			coin: {
				type: coinMutation,
				resolve: () => Coin
			},
			technologyThread: {
				type: threadMutation,
				resolve: () => TechnologyThread
			},
			coinThread: {
				type: threadMutation,
				resolve: () => CoinThread
			}
		}
	})
});
