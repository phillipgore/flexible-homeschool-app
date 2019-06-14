import {SchoolWork} from '../schoolWork.js';
import {Resources} from '../../resources/resources.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';

import _ from 'lodash'

Meteor.publish('schooYearStudentSchoolWork', function(schoolYearId, studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	return SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}, {sort: {name: 1}, fields: {order: 1, name: 1, studentId: 1, schoolYearId: 1}});
});

Meteor.publish('trackingViewPub', function(studentId, weekId) {
	if (!this.userId) {
		return this.ready();
	}


	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let lessons = Lessons.find({weekId: weekId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, completed: 1, assigned: 1, completedOn: 1, schoolWorkId: 1}});
	let schoolWorkIds = lessons.map(lesson => (lesson.schoolWorkId))
	let schoolWork = SchoolWork.find({_id: {$in: schoolWorkIds}, groupId: groupId, studentId: studentId, deletedOn: { $exists: false }}, {sort: {name: 1}, fields: {order: 1, name: 1, studentId: 1, schoolYearId: 1}});

	return [
		lessons,
		schoolWork
	]
});

Meteor.publish('schoolWork', function(schoolWorkId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolWork.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolWorkId}, {sort: {name: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}});
});

Meteor.publish('schoolWorkView', function(schoolWorkId) {
	if (!this.userId || schoolWorkId === 'empty') {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	let schoolWork = SchoolWork.find({_id: schoolWorkId, groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}});
	let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolWork.fetch()[0].schoolYearId}, {fields: {order: 1, schoolYearId: 1}});
	let lessons = Lessons.find({groupId: groupId, deletedOn: { $exists: false }, schoolWorkId: schoolWorkId}, {fields: {termId: 1}});
	let resources = Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: schoolWork.fetch()[0].resources}}, {fields: {link: 1, title: 1, type: 1}});

	return [
		schoolWork, 
		terms, 
		lessons,
		resources
	];
});

Meteor.publish('schoolWorkResources', function(schoolWorkId) {	
	if ( schoolWorkId ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolWork = SchoolWork.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: schoolWorkId});
		let resources = Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: schoolWork.resources}});

		return resources
	}
	return this.ready();
});
