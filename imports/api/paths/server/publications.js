import {Stats} from '../../stats/stats.js';
import {Paths} from '../../paths/paths.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';

import _ from 'lodash';
		
function getStatus(status) {
	if (_.includes(status, 'partial')) {
		return'partial';
	}
	if (_.includes(status, 'completed') && !_.includes(status, 'empty') && !_.includes(status, 'pending')) {
		return 'completed';
	}
	if (_.includes(status, 'empty') && !_.includes(status, 'completed') && !_.includes(status, 'pending')) {
		return 'empty';
	}
	if (_.includes(status, 'pending') && !_.includes(status, 'empty') && !_.includes(status, 'completed')) {
		return 'pending';
	}
}

Meteor.publish('allSchoolYearPaths', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return Paths.find({groupId: groupId, type: 'schoolYear'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}});
});

Meteor.publish('studentPaths', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.type': 1, 'preferredFirstName.name': 1}});
});

Meteor.publish('schoolYearPaths', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return [
		Paths.find({groupId: groupId, studentId: studentId, type: 'schoolYear'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}}),
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}}),
	];
});

Meteor.publish('termPaths', function(studentId, schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return [
		Paths.find({groupId: groupId, studentId: studentId, type: 'term'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}}),
		Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}}),
	];
});

Meteor.publish('weekPaths', function(studentId, termId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {termOrder: 1, order: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, deletedOn: 0}});
});




