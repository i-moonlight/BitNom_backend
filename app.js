"use strict";

const cors = require("cors");
const path = require("path");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const jwt = require("express-jwt");

const app = express();

const config = require("./config");

const graphqlSchema = require("./schema");

mongoose.connect(process.env.DB_URL || config.dbUrl, {
	useCreateIndex: true,
	useNewUrlParser: true
});

// Enable CORS
app.use(cors());
app.use("*", cors());

// authentication middleware
const authMiddleware = jwt({
	secret: process.env.APP_SECRET || config.secret,
	credentialsRequired: false,
	session: false
});
app.use("/graphql", authMiddleware);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,
		graphiql: process.env.GRAPHIQL || config.graphiql
	})
);

app.use(express.static(path.join(__dirname, "dist")));

app.listen(process.env.APP_PORT || config.port, () =>
	console.log(
		`Example app listening on port ${process.env.APP_PORT || config.port}!`
	)
);
