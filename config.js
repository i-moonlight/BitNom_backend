"use strict";

module.exports = {
	production: {
		dbUrl: "mongodb://bitnormApp:bitnormApp2018@127.0.0.1:27017/bitnorm",
		port: 3000,
		graphiql: false
	},
	development: {
		dbUrl:
			"mongodb://bitcoin_talk:bitcoin_talk2018@127.0.0.1:27017/bitcoin_talk",
		port: 3000,
		graphiql: true
	}
};
