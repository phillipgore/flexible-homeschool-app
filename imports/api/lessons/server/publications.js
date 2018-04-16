import {Lessons} from '../lessons.js';
import {Subjects} from '../../subjects/subjects.js'

Meteor.publish('allLessons', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('allLessonsProgress', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {completed: 1, subjectId: 1, weekId: 1}});
});

Meteor.publish('lesson', function(lessonId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, _id: lessonId});
});

Meteor.publish('subjectLessons', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: subjectId}, {sort: {order: 1}});
});

Meteor.publish('studentWeekLessons', function(studentId, weekId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let subjectIds = Subjects.find({studentId: studentId}).map(subject => subject._id);
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: {$in: subjectIds}, weekId: weekId}, {sort: {order: 1}});
});