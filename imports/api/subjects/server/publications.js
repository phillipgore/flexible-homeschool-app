import {Subjects} from '../subjects.js';
import {Resources} from '../../resources/resources.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';

Meteor.publish('allSubjects', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('allSubjectsProgress', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {studentId: 1, schoolYearId: 1}});
});

Meteor.publish('schooYearStudentSubjects', function(schoolYearId, studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	return Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});
});


Meteor.publish('studentWeekSubjects', function(studentId, weekId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	let subjectIds = Lessons.find({weekId: weekId}).map(lesson => (lesson.subjectId))
	return Subjects.find({_id: {$in: subjectIds}, groupId: groupId, studentId: studentId, deletedOn: { $exists: false }});
});

Meteor.publish('subject', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});
});

Meteor.publish('subjectComplete', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	let subject = Subjects.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});
	let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: subject.schoolYearId}).map(term => term._id);
	return [
		Subjects.find({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId}),
		Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: subject.resources}}),
		
		Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: subject.studentId}),
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: subject.schoolYearId}),

		Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: subject.schoolYearId}, {sort: {order: 1}}),
		Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}, {sort: {order: 1}}),
		Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: subject._id}, {sort: {order: 1}}),
	];
});

Meteor.publish('subjectResources', function(subjectId) {	
	if ( subjectId ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let subject = Subjects.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});

		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: subject.resources}});
	}
	return this.ready();
});
