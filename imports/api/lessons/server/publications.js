import {Lessons} from '../lessons.js';
import {Subjects} from '../../subjects/subjects.js'

Meteor.publish('subjectLessons', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Lessons.find({groupId: groupId, deletedOn: { $exists: false }, subjectId: subjectId}, {sort: {order: 1}, fields: {order: 1, weekId: 1, subjectId: 1, completed: 1}});
});