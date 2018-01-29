import {Lessons} from '../lessons.js';

Meteor.publish('allLessons', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('lesson', function(lessonId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, _id: lessonId});
});

Meteor.publish('subjectLessons', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: subjectId}, {sort: {order: 1}});
});