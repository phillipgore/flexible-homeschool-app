import {SchoolYears} from '../schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Subjects} from '../../subjects/subjects.js';
import {Lessons} from '../../lessons/lessons.js';

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}});
});

Meteor.publish('schoolYear', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId});
});

Meteor.publish('schoolYearComplete', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}).map(term => term._id);
	let weekIds = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}).map(week => week._id);

	return [
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}),
		Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}}),
		Subjects.find(
			{groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, 
			{sort: {order: 1}, fields: {schoolYearId: 1, name: 1}}
		),
		Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}, {sort: {order: 1}}),
		Lessons.find({groupId: groupId, deletedOn: { $exists: false }, weekId: {$in: weekIds}}, {sort: {order: 1}}),
	];
});