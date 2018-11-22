mutation createGroup(
	$name: String = "maintainer",
  $permissions: [PermissionsInput]! = [
    { model: "User", endpoint: "create", owned: false },
    { model: "User", endpoint: "create", owned: false },
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

mutation updateGroup(
  $_id:String = "5be03f7cce03473136611a14",
  $name:String = "maintainer",
  $permissions: PermissionsInput = {
    name: "AccessGroup"
    create: true,
    read: true,
    update: true,
    delete: true
  }
) {
  accessGroup {
    update(_id: $_id, name: $name, permission: $permissions) {
      _id
			name
			permissions {
				_id name create read update delete
			}
    }
  }
}

mutation deleteGroupPermission(
  $_id:String = "5be03e7b5b972d306f464a59",
  $permissionId: String = "5be03e7b5b972d306f464a5b"
) {
  accessGroup {
    deletePermission(_id: $_id, permissionId: $permissionId) {
      _id
			name
			permissions {
				_id name create read update delete
			}
    }
  }
}

mutation deleteGroup(
  $ids:[String] = ["5be03f7cce03473136611a14"]
) {
  accessGroup {
    delete(ids: $ids)
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

mutation updateUserAccessGroup(
  $_id: String = "5bde4b5ae5f3624730edb81e",
  $accessGroup:String = "5bdd6ffef5a50517ce5392d8"
) {
  user {
    updateAccessGroup(_id: $_id, accessGroup: $accessGroup) {
      _id displayName email avatar access
    }
  }
}

mutation updateUserDisplayName(
  $displayName:String = "New Name"
) {
  user {
    updateDisplayName(displayName: $displayName) {
      _id displayName email avatar access
    }
  }
}

mutation resetUserPassword (
  $email: String = "example@email.com"
) {
  user {
    resetPassword(email: $email)
  }
}

mutation deleteUser(
  $ids: [String] = ["5be3e6a04c04fa54dded0224"]
) {
  user {
    delete(ids: $ids)
  }
}

query getCoin(
	$_id: String = "",
	$partial: Boolean = false,
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

mutation voteForCoin(
  $invoiceId: String = "RandomString1",
  $user: String = "5bab3fba9927f84421ee9102",
  $candidate: String = "5bab3fba9927f84421ee9103",
  $amount:Float = 2000000
) {
  coin {
    vote(
      invoiceId: $invoiceId,
      user: $user,
      candidate: $candidate,
      amount: $amount
    ) {
      _id invoiceId user candidate amount date
    }
  }
}

query getCoinVotes(
  $candidate: String = "5bab3fba9927f84421ee9103"
) {
  coin {
    votes(candidate: $candidate) {
      _id invoiceId user candidate amount date
    }
  }
}

mutation createTechnology(
  $technology: TechnologyInput = {
    name: "BitCoin",
    focus: "Banking Finance",
    description: "A blockchain network for banking finance."
    tags: ["finance", "blockchain", "banking"],
    features: ["high security", "proof of work"],
    innovations: ["peer to peer transfers"],
    repository: "https://github.com/bitcoin",
    website: "https://www.bitcoin.org"
  }
) {
  technology {
    create(technology: $technology) {
      _id
      logo
    	name
    	focus
    	description
    	tags
    	features
    	innovations
    	repository
    	website
      user
      follows
      date
    }
  }
}

query getTechnologies(
  $pagination: PaginationInput = {}
) {
  technology {
    get(pagination: $pagination) {
      _id
      logo
    	name
    	focus
    	description
    	tags
    	features
    	innovations
    	repository
    	website
      user
      follows
      date
    }
  }
}

mutation updateTechnology(
  $_id: String = "5be3feed011ec868ec903412",
  $technology: TechnologyInput = {
    name: "IsACoin",
    focus: "Underground Banking Finance",
    description: "A blockchain network for underground banking finance."
    tags: ["finance", "blockchain", "banking", "underground"],
    features: ["high security", "proof of work"],
    innovations: ["peer to peer transfers"],
    repository: "https://github.com/isacoin",
    website: "https://www.isacoin.org"
  }
) {
  technology {
    update(_id: $_id, technology: $technology) {
      _id
      logo
    	name
    	focus
    	description
    	tags
    	features
    	innovations
    	repository
    	website
      user
      follows
      date
    }
  }
}

mutation deleteTechnology(
  $ids: [String] = [""]
) {
  technology {
    delete(ids: $ids)
  }
}