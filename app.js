"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const jwt = require("express-jwt");

const app = express();

const config = require("./config");

const envConfig = process.env.PRODUCTION
	? config.production
	: config.development;

const graphqlSchema = require("./schema");

mongoose.connect(
	envConfig.dbUrl,
	{
		useCreateIndex: true,
		useNewUrlParser: true
	}
);

// authentication middleware
const authMiddleware = jwt({
	secret: config.secret,
	credentialsRequired: false,
	session: false
});
app.use("/graphql", authMiddleware);

// Enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,
		graphiql: envConfig.graphiql
	})
);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(envConfig.port, () =>
	console.log(`Example app listening on port ${envConfig.port}!`)
);
