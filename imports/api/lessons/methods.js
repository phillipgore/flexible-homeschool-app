import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';


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
	},

	batchInsertLessons(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) { 
			Lessons.insert(lesson);
		});
	},

	batchUpdateLessons: function(lessonProperties) {
		let total = lessonProperties.length
		lessonProperties.forEach(function(lesson, index) {
			Lessons.update(lesson._id, {$set: lesson});
		});
	},

	bulkWriteLessons: function(bulkLessonProperties) {
		Lessons.rawCollection().bulkWrite(bulkLessonProperties)
	},

	batchRemoveLessons: function(lessonIds) {
		Lessons.remove({_id: {$in: lessonIds}});
	},
})