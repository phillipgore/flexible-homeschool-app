import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';

Meteor.methods({
	updateLesson: function(lessonId, lessonProperties) {
		Lessons.update(lessonId, {$set: lessonProperties});
	},

	batchInsertLessons(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) { 
			Lessons.insert(lesson);
		});
	},

	batchUpdateLessons: function(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) {
			Lessons.update(lesson._id, {$set: lesson});
		});
	},

	batchRemoveLessons: function(lessonIds) {
		lessonIds.forEach(function(lessonId, index) {
			Lessons.remove(lessonId);
		});
	},
})