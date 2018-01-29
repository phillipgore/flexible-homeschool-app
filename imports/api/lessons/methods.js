import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';

Meteor.methods({
	batchInsertLessons(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) { 
			console.log('insert: ' + index)
			Lessons.insert(lesson);
		});
	},

	batchUpdateLessons: function(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) {
			console.log('update: ' + index) 
			Lessons.update(lesson._id, {$set: lesson});
		});
	},

	batchRemoveLessons: function(lessonIds) {
		lessonIds.forEach(function(lessonId, index) {
			console.log('remove: ' + index)
			Lessons.remove(lessonId);
		});
	}
})