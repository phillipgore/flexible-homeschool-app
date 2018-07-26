import {Subjects} from '../subjects.js';
import {Resources} from '../../resources/resources.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';

import _ from 'lodash'

Meteor.publish('schooYearStudentSubjects', function(schoolYearId, studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	return Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}, {sort: {name: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0}});
});


Meteor.publish('trackingViewPub', function(studentId, weekId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let lessonSubjectIds = Subjects.find({studentId: studentId, deletedOn: { $exists: false }}).map(subject => subject._id);	
	let subjectIds = Lessons.find({weekId: weekId, deletedOn: { $exists: false }}).map(lesson => (lesson.subjectId))
	let resourceIds = _.flattenDeep(Subjects.find({_id: {$in: subjectIds}, groupId: groupId, studentId: studentId, deletedOn: { $exists: false }}).map(subject => subject.resources));

	return [
		Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: studentId}),
		Subjects.find({_id: {$in: subjectIds}, groupId: groupId, studentId: studentId, deletedOn: { $exists: false }}, {sort: {name: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}}),
		Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: resourceIds}}, {sort: {title: 1}, fields: {title: 1, type: 1}}),
		Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: {$in: lessonSubjectIds}, weekId: weekId}, {sort: {order: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}})
	]
});

Meteor.publish('subject', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId}, {sort: {name: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0}});
});

Meteor.publish('subjectView', function(subjectId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let subject = Subjects.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId}, {sort: {name: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0}});

		if (subject) {
			let student = Students.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subject.studentId});
			let schoolYear = SchoolYears.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subject.schoolYearId});
			let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: subject.schoolYearId});
			let resources = Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: subject.resources}});

			termStats = []
			terms.forEach((term) => {
				let weekIds = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: term._id}).map((week) => (week._id));
				let lessonCount = Lessons.find({subjectId: subjectId, weekId: {$in: weekIds}}).count();
				termStats.push({termOrder: term.order, lessonCount: lessonCount});
			})

			subject.preferredFirstName = student.preferredFirstName.name;
			subject.lastName = student.lastName;
			subject.startYear = schoolYear.startYear;
			subject.endYear = schoolYear.endYear;
			subject.termStats = termStats;

			self.added('subjects', subject._id, subject);
			resources.map((resource) => {;
				self.added('resources', resource._id, resource);
			});
		}

		self.ready();
	});
});

Meteor.publish('subjectResources', function(subjectId) {	
	if ( subjectId ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let subject = Subjects.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});

		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: subject.resources}});
	}
	return this.ready();
});
