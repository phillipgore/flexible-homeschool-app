import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';

Meteor.methods({
	insertLesson(lessonProperties) {
		Lessons.insert(lessonProperties);
	},

	updateLesson: function(lessonId, lessonProperties) {
		Lessons.update(lessonId, {$set: lessonProperties});
	},

	archiveLesson: function(lessonId) {
		Lessons.update(lessonId, {$set: {archive: true}});
	}
})