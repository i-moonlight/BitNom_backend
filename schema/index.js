"use strict";

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLBoolean
} = require("graphql");

require("../models")();
const Coin = require("../api/coin");

const coinInterface = require("./coin");
const githubType = require("./github");
const completeType = require("./complete");
const partialType = require("./partial");

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQueryType",
		fields: {
			hello: {
				type: GraphQLString,
				resolve() {
					return "Hello, world!";
				}
			},
			coin: {
				type: GraphQLList(coinInterface),
				args: {
					partials: {
						type: GraphQLBoolean,
						description:
							"Specifies if the fetch is from the Partials collection."
					}
				},
				async resolve(root, { partials }) {
					return Coin.get({ partials });
				}
			}
		}
	}),
	types: [partialType, completeType, githubType]
});
