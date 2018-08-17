import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';


Meteor.methods({
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
			console.log(index +' of '+ total)
		});
	},

	bulkWriteLessons: function(bulkLessonProperties) {
		console.log('bulk write Lessons start-----')
		Lessons.rawCollection().bulkWrite(bulkLessonProperties)
		console.log('-----bulk write Lessons end')
	},

	batchRemoveLessons: function(lessonIds) {
		lessonIds.forEach(function(lessonId, index) {
			Lessons.remove(lessonId);
		});
	},
})