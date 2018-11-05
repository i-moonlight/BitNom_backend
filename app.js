"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const app = express();

const config = process.env.PRODUCTION
	? require("./config").production
	: require("./config").development;

const graphqlSchema = require("./schema");

mongoose.connect(
	config.dbUrl,
	{
		useCreateIndex: true,
		useNewUrlParser: true
	}
);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,
		graphiql: config.graphiql
	})
);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(config.port, () =>
	console.log(`Example app listening on port ${config.port}!`)
);
