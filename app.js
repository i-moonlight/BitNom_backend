"use strict";

const cors = require("cors");
const path = require("path");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const superagent = require("superagent");
const jwt = require("express-jwt");
const bodyParser = require("body-parser");
const fallback = require("express-history-api-fallback");

const app = express();

const config = require("./config");

const graphqlSchema = require("./schema");

const schemaEndpoints = require("./schema/schema-endpoints");

mongoose.connect(process.env.DB_URL || config.dbUrl, {
	useCreateIndex: true,
	useNewUrlParser: true
});

const adminAccessGroup = {
	name: "admin",
	permissions: Object.keys(schemaEndpoints)
		.map(schema => {
			return schemaEndpoints[schema].map(endpoint => ({
				model: schema,
				endpoint: endpoint
			}));
		})
		.reduce((acc, val) => acc.concat(val), [])
};

// Add admin access group if it does not exist
mongoose
	.model("AccessGroup")
	.findOne({ name: "admin" })
	.then(adminGroup => {
		if (!adminGroup) {
			return mongoose.model("AccessGroup").create(adminAccessGroup);
		} else {
			for (let key in adminAccessGroup) {
				adminGroup[key] = adminAccessGroup[key];
			}
			return adminGroup.save();
		}
	})
	.then(savedAdminAccessGroup => {
		return mongoose
			.model("User")
			.findOne({ email: "admin@email.com" })
			.then(savedAdmin => {
				if (!savedAdmin) {
					return mongoose.model("User").create({
						email: "admin@email.com",
						displayName: "Admin",
						access: savedAdminAccessGroup._id,
						date: new Date(),
						password: "Bit-Norm+2018",
						verified: true,
						verificationString: "verified",
						credits: 0
					});
				} else {
					savedAdmin.access = savedAdminAccessGroup._id;
					return savedAdmin.save();
				}
			});
	})
	.then(() => console.log("Admin user created successfully!"))
	.catch(error => console.log(error));

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

// Support SPA routing
const appRoot = path.join(__dirname, "dist");
app.use(express.static(appRoot));
app.use(fallback("index.html", { root: appRoot }));

app.use(bodyParser.json());

app.post("/github", (req, res) => {
	const query = req.body;
	if (!query.query)
		return res.status(400).json({ message: "A query is required" });
	const githubToken = process.env.GITHUB_TOKEN || config.githubToken;
	return superagent
		.post("https://api.github.com/graphql")
		.set("Authorization", `Bearer ${githubToken}`)
		.send(query)
		.then(({ body }) => res.json(body))
		.catch(error => res.status(error.status).send(error.response.text));
});

app.listen(process.env.APP_PORT || config.port, () =>
	console.log(
		`Example app listening on port ${process.env.APP_PORT || config.port}!`
	)
);
