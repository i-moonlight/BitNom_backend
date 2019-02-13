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
						avatar: "avatar.png",
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

app.use(express.static(path.join(__dirname, "dist")));

app.listen(process.env.APP_PORT || config.port, () =>
	console.log(
		`Example app listening on port ${process.env.APP_PORT || config.port}!`
	)
);
