"use strict";

module.exports = {
	user: [
		"get",
		"search",
		"create",
		"changePassword",
		"updateDisplayName",
		"updateAccessGroup",
		"resetPassword",
		"delete"
	],
	coin: ["get", "search", "votes", "vote"],
	thread: [],
	technology: ["get", "search", "votes", "create", "delete", "update"],
	accessGroup: ["get", "create", "delete", "deletePermission", "update"]
};
