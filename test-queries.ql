mutation createGroup(
	$name: String = "maintainer",
  $permissions: [PermissionsInput]! = [
    { name: "User", create: true, read: true, update: true, delete: true },
    {
      name: "AccessGroup", create: false, read: true, update: false, delete: false
    }
  ]
) {
	accessGroup {
		create(
			name: $name
			permissions: $permissions
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
	$name: String = "",
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
	$email: String = "example2@email.com",
	$password: String = "password"
) {
	user {
		create(email: $email, password: $password) {
			_id displayName email avatar access
		}
	}
}

query getUser(
	$email: String = "",
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
	$searchString: String = "example example1"
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

query login(
  $email: String! = "example@email.com",
  $password:String! = "password"
) {
  login(email: $email, password: $password)
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
	$searchString: String = "doge"
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

