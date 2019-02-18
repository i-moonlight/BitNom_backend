"use strict";

const {
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLList,
	GraphQLInt
} = require("graphql");

const { paginationInput } = require("./input-types");

const userType = new GraphQLObjectType({
	name: "User",
	description: "Site user.",
	fields() {
		return {
			_id: {
				type: GraphQLNonNull(GraphQLString),
				description: "The user's auto-assigned database ID."
			},
			displayName: {
				type: GraphQLString,
				description: "The user provided username."
			},
			email: {
				type: GraphQLString,
				description: "The user's email."
			},
			avatar: {
				type: GraphQLString,
				description: "The name given to the saved user's picture."
			},
			access: {
				type: GraphQLString,
				description: "ID of the access group to which the user belongs."
			},
			date: {
				type: GraphQLString,
				description: "The user's signup date."
			},
			credits: {
				type: GraphQLInt,
				description: "The credits earned by the user."
			},
			verified: {
				type: GraphQLBoolean,
				description:
					"A boolean indicating if the user has verified their account."
			},
			slogan: {
				type: GraphQLString,
				description: "A user provided string."
			}
		};
	}
});

const userQuery = new GraphQLObjectType({
	name: "UserQuery",
	description: "Api for querying for user(s) information.",
	fields: () => ({
		get: {
			type: GraphQLList(userType),
			args: {
				_id: {
					type: GraphQLString,
					description: `
						If provided, the user with a matching Id is returned.`
				},
				email: {
					type: GraphQLString,
					description: `
						If provided, the user with a matching email is returned.`
				},
				access: {
					type: GraphQLString,
					description: `
						An ID refering to an access group which when provided,
						all users with the referred to access level are returned.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		},
		me: {
			type: userType,
			description: "Returns the currently logged in user."
		},
		search: {
			type: GraphQLList(userType),
			args: {
				searchString: {
					type: GraphQLString,
					description: `
						The user provided string to be used as the parameter
						to the search function.`
				},
				access: {
					type: GraphQLString,
					description: `
						If provided, limits result set to users of specified access
						group returned.`
				},
				pagination: { type: GraphQLNonNull(paginationInput) }
			}
		}
	}),
	types: [userType]
});

const userMutation = new GraphQLObjectType({
	name: "UserMutation",
	description: "API for mutating or creating a user.",
	fields: () => ({
		create: {
			type: userType,
			args: {
				displayName: {
					type: GraphQLNonNull(GraphQLString),
					description: `The user's desired display name`
				},
				email: {
					type: GraphQLNonNull(GraphQLString),
					description: `An email to uniquely identify a user.`
				},
				password: {
					type: GraphQLNonNull(GraphQLString),
					description: `A password to authenticate the user.`
				}
			}
		},
		changePassword: {
			type: GraphQLString,
			description: "Change a user's password",
			args: {
				oldPassword: {
					type: GraphQLString,
					description: "The user's old password."
				},
				newPassword: {
					type: GraphQLString,
					description: "The user's new password."
				},
				confirmPassword: {
					type: GraphQLString,
					description:
						"A second string that should match the new password."
				}
			}
		},
		update: {
			type: userType,
			description: "Update the display name of a given user.",
			args: {
				displayName: {
					type: GraphQLString,
					description: "The new display name of the user."
				},
				slogan: {
					type: GraphQLString,
					description: "The user's preferred slogan."
				}
			}
		},
		updateAccessGroup: {
			type: userType,
			description: "Update the access group of a given user.",
			args: {
				_id: {
					type: GraphQLString,
					description: "The ID to be used to fetch the user."
				},
				accessGroup: {
					type: GraphQLString,
					description: "The ID of the user's new access group."
				}
			}
		},
		resetPassword: {
			type: GraphQLString,
			description: "Reset the password for a given user.",
			args: {
				email: {
					type: GraphQLString,
					description: "The email to be used to identify the user."
				}
			}
		},
		delete: {
			type: GraphQLString,
			description: "Delete a users by specifying their IDs.",
			args: {
				ids: {
					type: GraphQLList(GraphQLString),
					description:
						"An array containing the IDs of the users to be deleted."
				}
			}
		}
	}),
	types: [userType]
});

module.exports = {
	userType,
	userQuery,
	userMutation
};
