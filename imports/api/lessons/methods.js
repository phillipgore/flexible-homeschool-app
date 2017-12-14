import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Lessons} from './lessons.js';

Meteor.methods({
	insertLesson(lessonProperties) {
		const lessonId = Lessons.insert(lessonProperties);
		return lessonId
	},

	updateLesson: function(lessonId, lessonProperties) {
		Lessons.update(lessonId, {$set: lessonProperties});
	},

	archiveLesson: function(lessonId) {
		Lessons.update(lessonId, {$set: {archive: true}});
	}
})