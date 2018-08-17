import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Weeks} from './weeks.js';

Meteor.methods({
	updateWeek: function(weekId, weekProperties) {
		Weeks.update(termId, {$set: termProperties});
	},

	deleteWeek: function(weekId) {
		let lessonIds = Lessons.find({weekId: weekId}).map(lesson => (lesson._id));

		Weeks.update(termId, {$set: {deletedOn: new Date()}});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	},

	batchInsertWeeks(weekProperties) {
		weekProperties.forEach(function(week) {
			Weeks.insert(week);
		})
	},

	batchRemoveWeeks: function(weekIds) {
		weekIds.forEach(function(weekId, index) {
			Weeks.remove(weekId);
		});
	},

	bulkWriteWeeks: function(bulkWeekProperties) {
		console.log('bulk write Weeks start-----')
		let test = Weeks.rawCollection().bulkWrite(bulkWeekProperties);
		console.log('-----bulk write Weeks end')
	},
})