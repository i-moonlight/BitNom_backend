"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	name: { type: String },
	abbreviation: { type: String },
	logo: { type: String },
	about: { type: String },
	description: { type: String },
	topic: {
		title: { type: String },
		link: { type: String, unique: true },
		startedBy: {
			username: { type: String },
			profile: { type: String }
		},
		replies: [
			{
				no: { type: Number },
				date: { type: Date }
			}
		],
		views: [
			{
				no: { type: Number },
				date: { type: Date }
			}
		],
		lastPostDate: { type: Date },
		announcementDate: { type: Date },
		githubLinks: [{ type: String }],
		parsed: { type: Boolean, default: false }
	},
	github: {
		watch: { type: Number },
		stars: { type: Number },
		forks: { type: Number },
		issues: { type: Number },
		pulls: { type: Number },
		commits: { type: Number },
		branches: { type: Number },
		releases: { type: Number },
		contributors: { type: Number },
		link: { type: String }
	}
});

schema.index({ name: "text", "topic.name": "text" });

mongoose.model("Coin", schema);
