import {SchoolYears} from '../schoolYears.js';
import {Students} from '../../students/students.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Subjects} from '../../subjects/subjects.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';
import _ from 'lodash'

Meteor.publish('firstSchoolYear', function(startYear) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	function schoolYearId(year) {
		if (SchoolYears.findOne({startYear: {$gte: startYear}}, {sort: {starYear: 1}})) {
			return SchoolYears.findOne({startYear: {$gte: startYear}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;
		}
		return SchoolYears.findOne({startYear: {$lte: startYear}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id
	};
	
	let termId = Terms.findOne({groupId: groupId, schoolYearId: schoolYearId(startYear), deletedOn: { $exists: false }}, {sort: {order: 1}})._id;

	return [
		SchoolYears.find({_id: schoolYearId(startYear), groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}, limit: 1}),
		Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, limit: 1}),
		Terms.find({groupId: groupId, schoolYearId: schoolYearId(startYear), deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}, limit: 1}),
		Weeks.find({groupId: groupId, termId: termId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, termId: 1}, limit: 1}),
	]
});

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
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

Meteor.publish('schoolYearTrack', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({groupId: groupId, schoolYearId: schoolYearId}).map(term => (term._id));

	return [
		SchoolYears.find({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}),
		Subjects.find({groupId: groupId}, {fields: {studentId: 1, schoolYearId: 1}}),
		Weeks.find({groupId: groupId, termId: {$in: termIds}}, {fields: {termId: 1}}),
		Lessons.find({groupId: groupId}, {sort: {order: 1}, fields: {order: 1, completed: 1, subjectId: 1, weekId: 1}}),
	]
});

Meteor.publish('schoolYearReport', function(schoolYearId, studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({groupId: groupId, schoolYearId: schoolYearId}).map(term => (term._id));
	let subjectIds = Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId}).map(subject => (subject._id));
	let resourceIds = _.flatten( Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId}).map(subject => (subject.resources)) );

	return [
		SchoolYears.find({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}),
		Terms.find({groupId: groupId, schoolYearId: schoolYearId}),
		Weeks.find({groupId: groupId, termId: {$in: termIds}}),
		Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId}),
		Resources.find({_id: {$in: resourceIds}, groupId: groupId}),
		Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}}),
	]
});









