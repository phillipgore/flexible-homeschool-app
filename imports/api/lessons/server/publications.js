import {Lessons} from '../lessons.js';
import {Subjects} from '../../subjects/subjects.js'

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
	let subjectIds = Subjects.find({studentId: studentId, deletedOn: { $exists: false }}).map(subject => subject._id);
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: {$in: subjectIds}, weekId: weekId}, {sort: {order: 1}});
});