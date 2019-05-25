import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Weeks} from './weeks.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	updateWeek: function(weekId, weekProperties) {
		Weeks.update(termId, {$set: termProperties});
	},

	deleteWeek: function(weekId) {
		let lessonIds = Lessons.find({weekId: weekId}).map(lesson => (lesson._id));

		Weeks.remove({_id: weekId});
		Lessons.remove({_id: {$in: lessonIds}});
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
		Weeks.rawCollection().bulkWrite(bulkWeekProperties);
	},
})