"use strict";

const mongoose = require("mongoose");

// define the schema
module.exports = mongoose.Schema({
	// fields
	coinName: { type: String },
	abbreviation: { type: String },
	topicName: { type: String },
	topicLink: { type: String },
	githubLink: { type: String },
	startedBy: { type: String },
	profileLink: { type: String },
	replies: { type: String },
	views: { type: String },
	lastPostDate: { type: Date },
	announcementDate: { type: Date },
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
		repository: { type: String }
	}
});
