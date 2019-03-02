"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	name: { type: String },
	abbreviation: { type: String },
	logo: { type: String },
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
		link: { type: String },
		shortDescription: { type: String },
		description: { type: String },
		updateTime: { type: Date },
		primaryLanguage: {
			name: { type: String },
			color: { type: String }
		},
		languages: [
			{
				name: { type: String },
				color: { type: String }
			}
		],
		createdAt: { type: Date },
		pushedAt: { type: Date },
		isFork: { type: Boolean },
		isArchived: { type: Boolean },
		isPrivate: { type: Boolean },
		dynamic: [
			{
				watch: { type: Number },
				stars: { type: Number },
				forks: { type: Number },
				openIssues: { type: Number },
				closedIssues: { type: Number },
				openPullRequests: { type: Number },
				closedPullRequests: { type: Number },
				openProjects: { type: Number },
				closedProjects: { type: Number },
				commits: { type: Number },
				branches: { type: Number },
				releases: { type: Number },
				contributors: { type: Number },
				date: { type: Date }
			}
		]
	}
});

schema.index({ name: "text", "topic.name": "text" });

mongoose.model("Coin", schema);
