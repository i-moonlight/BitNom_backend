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
const { Coin, User, login, AccessGroup } = require("../api");

const { coinQuery, completeType, partialType } = require("./coin");
const { userQuery, userMutation } = require("./user");
const { accessGroupQuery, accessGroupMutation } = require("./access-group");

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQueryType",
		fields: {
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
			}
		}
	}),
	types: [completeType, partialType]
});
