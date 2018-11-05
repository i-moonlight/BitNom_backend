mutation createGroup(
	$name: String = "admin",
	$collections: [PermissionsInput]
) {
	accessGroup {
		create(
			name: $name
			permissions: $collections
		) {
			_id
			name
			permissions {
				_id name create read update delete
			}
		}
	}
}

query getGroups(
	$name: String = "admin",
	$_id: String = "",
	$pagination: PaginationInput = {
		limit: 20,
		skip: 0
	}
) {
	accessGroup {
		get(name: $name, _id: $_id, pagination: $pagination) {
			_id
			name
			permissions {
				_id name create read update delete
			}
		}
		
	}
}

mutation createUser(
	$email: String = "example@email.com",
	$password: String = "password"
) {
	user {
		create(email: $email, password: $password) {
			_id displayName email avatar access
		}
	}
}

query getUser(
	$email: String = "example@email.com",
	$_id: String = "",
	$pagination: PaginationInput = {
		limit: 20,
		skip: 0
	}
) {
	user {
		get(email: $email, _id: $_id, pagination: $pagination) {
			_id displayName email avatar access
		}
	}
}

query searchUser(
	$searchString: String = "example user"
	$pagination: PaginationInput = {
		limit: 20,
		skip: 0
	}
) {
	user {
		search(searchString: $searchString, pagination: $pagination) {
			_id displayName email avatar access
		}
	}
}

query getCoin(
	$_id: String = "",
	$partial: Boolean = true,
	$pagination: PaginationInput = {
		limit: 20,
		skip: 0
	}
) {
	coin {
		get(_id: $_id, partial: $partial, pagination: $pagination) {
			_id coinName abbreviation topicName topicLink githubLink
			startedBy profileLink replies views lastPostDate
			announcementDate
			github {
				watch stars forks issues pulls commits branches releases
				contributors repository
			}
		}
	}
}

query searchCoin(
	$searchString: String = "monero"
	$pagination: PaginationInput = {
		limit: 20,
		skip: 0
	}
) {
	coin {
		search(searchString: $searchString, pagination: $pagination) {
			_id coinName abbreviation topicName topicLink githubLink
			startedBy profileLink replies views lastPostDate
			announcementDate
			github {
				watch stars forks issues pulls commits branches releases
				contributors repository
			}
		}
	}
}

