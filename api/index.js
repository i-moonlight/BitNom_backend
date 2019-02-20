"use strict";

const Thread = require("./thread");

module.exports = {
	AccessGroup: require("./access-group"),
	Coin: require("./coin"),
	login: require("./login"),
	User: require("./user"),
	Technology: require("./technology"),
	SourceCode: require("./source-code"),
	CoinThread: require("./thread")("CoinThread"),
	TechnologyThread: require("./thread")("TechnologyThread"),
	Message: require("./message"),
	Feedback: require("./feedback")
};
