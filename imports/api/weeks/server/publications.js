import {Weeks} from '../weeks.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Lessons} from '../../lessons/lessons.js';
import {weekStatus} from '../../../modules/server/functions';

Meteor.publish('allWeeks', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('weeksPath', function(termId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		SchoolYears.find();
		Terms.find();
		Lessons.find();

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let weeks = Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});

		weeks.map((week) => {
			week = weekStatus(week, week._id, studentId);
			self.added('weeks', week._id, week);
		});

		self.ready();
	});
});

// Meteor.publish('firstWeeks', function(schoolYearId) {
// 	if (!this.userId) {
// 		return this.ready();
// 	}

// 	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
// 	let termIds = Terms.find({schoolYearId: schoolYearId}).map(term => (term._id));
// 	let weekIds = [];

// 	termIds.forEach(function(termId) {
// 		weekIds.push(Weeks.findOne({groupId: groupId, deletedOn: { $exists: false }, termId: termId}, {sort: {order: 1}})._id)
// 	})

// 	return Weeks.find({_id: {$in: weekIds}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
// });

// Meteor.publish('allWeeksProgress', function() {
// 	if (!this.userId) {
// 		return this.ready();
// 	}

// 	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
// 	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {termId: 1}});
// });

// Meteor.publish('termWeeks', function(termId) {
// 	if (!this.userId) {
// 		return this.ready();
// 	}

// 	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
// 	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: termId}, {sort: {order: 1}});
// });