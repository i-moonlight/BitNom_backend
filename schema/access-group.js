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
						model: {
							type: GraphQLString,
							description: `The name of a specific schema model.`
						},
						endpoint: {
							type: GraphQLString,
							description: `The name of a specific schema function.`
						},
						owned: {
							type: GraphQLBoolean,
							description: `
								A boolean that determines if the owned constraint applies.`
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
		},
		delete: {
			type: GraphQLList(GraphQLString),
			description: "Delete access groups by specifying their IDs.",
			args: {
				ids: {
					type: GraphQLList(GraphQLString),
					description:
						"An array containing the IDs of the access groups to be deleted."
				}
			}
		},
		deletePermission: {
			type: accessGroupType,
			description: "Delete a permission from an access group.",
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of the target access group."
				},
				permissionId: {
					type: GraphQLString,
					description: "The ID of the permission to be deleted."
				}
			}
		},
		update: {
			type: accessGroupType,
			description:
				"Update the name of a or permissions in an access group.",
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID of the target access group."
				},
				name: {
					type: GraphQLString,
					description: "The new name of the access group."
				},
				permission: {
					type: GraphQLNonNull(permissionsInput),
					description:
						"The new permissions. NOTE: The name is not updateable."
				}
			}
		}
	}),
	types: [accessGroupType]
});

module.exports = { accessGroupType, accessGroupQuery, accessGroupMutation };
