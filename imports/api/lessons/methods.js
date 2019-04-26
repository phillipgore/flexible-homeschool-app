import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';
import {primaryInitialIds} from '../../modules/server/initialIds';


Meteor.methods({
	getLesson(lessonId) {
		if (!this.userId) {
			return false;
		}

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		return Lessons.findOne({_id: lessonId, groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}});
	},

	updateLesson: function(lessonProperties) {
		Lessons.update(lessonProperties._id, {$set: lessonProperties});
		primaryInitialIds();
	},

	bulkWriteLessons: function(bulkLessonProperties) {
		Lessons.rawCollection().bulkWrite(bulkLessonProperties)
	},

	batchRemoveLessons: function(lessonIds) {
		lessonIds.forEach(function(lessonId, index) {
			Lessons.remove(lessonId);
		});
	},
})