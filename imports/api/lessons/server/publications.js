import {Lessons} from '../lessons.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js'

Meteor.publish('schoolWorkLessons', function(schoolWorkId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, schoolWorkId: schoolWorkId}, {sort: {order: 1}, fields: {order: 1, weekId: 1, schoolWorkId: 1, completed: 1}});
});

Meteor.publish('lesson', function(lessonId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({_id: lessonId, groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}});
});

