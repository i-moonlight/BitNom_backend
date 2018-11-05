"use strict";

const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLBoolean
} = require("graphql");

const { paginationInput, permissionsInput } = require("./input-types");

const accessGroupType = new GraphQLObjectType({
	name: "AccessGroupType",
	description: "Lists the permissions a given group has.",
	fields: () => ({
		_id: {
			type: GraphQLString,
			description: `An auto-assigned database ID.`
		},
		name: {
			type: GraphQLString,
			description: `A descriptive name used to identify a given access group.`
		},
		permissions: {
			type: GraphQLList(
				new GraphQLObjectType({
					name: "PermissionsEntry",
					description: `An entry defining a group's permissions on a given
							collection.`,
					fields: () => ({
						_id: {
							type: GraphQLNonNull(GraphQLString),
							description: `An auto-assigned database ID.`
						},
						name: {
							type: GraphQLString,
							description: `The name of a given collection.`
						},
						create: {
							type: GraphQLBoolean,
							description: `The group's create permissions on the collection.`
						},
						read: {
							type: GraphQLBoolean,
							description: `The group's read permissions on the collection.`
						},
						update: {
							type: GraphQLBoolean,
							description: `The group's update permissions on the collection.`
						},
						delete: {
							type: GraphQLBoolean,
							description: `The group's delete permissions on the collection.`
						}
					})
				})
			)
		}
	})
});

const accessGroupQuery = new GraphQLObjectType({
	name: "AccessGroupQuery",
	description: "The API for accessing access groups' information.",
	fields: () => ({
		get: {
			type: GraphQLList(accessGroupType),
			description: `Get access groups information.`,
			args: {
				_id: {
					type: GraphQLString,
					description: `An auto-assigned database ID associated with the access group.`
				},
				name: {
					type: GraphQLString,
					description: `The descriptive name assigned to the access group.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		}
	}),
	types: [accessGroupType]
});

const accessGroupMutation = new GraphQLObjectType({
	name: "AccessGroupMutation",
	description: "The API for creating, modifying and deleting access groups.",
	fields: () => ({
		create: {
			type: accessGroupType,
			description: `Get access groups information.`,
			args: {
				name: {
					type: GraphQLString,
					description: `The descriptive name to assign to the access group.`
				},
				permissions: {
					type: GraphQLNonNull(GraphQLList(permissionsInput))
				}
			}
		}
	}),
	types: [accessGroupType]
});

module.exports = { accessGroupType, accessGroupQuery, accessGroupMutation };
