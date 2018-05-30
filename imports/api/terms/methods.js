import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Terms} from './terms.js';

Meteor.methods({
	insertTerm(termProperties) {
		const termId = Terms.insert(termProperties);
		return termId;
	},

	updateTerm: function(termId, termProperties) {
		Terms.update(termId, {$set: termProperties});
	},

	deleteTerm: function(termId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonIds = Lessons.find({weekId: {$in: weekIds}}).map(lesson => (lesson._id));

		Terms.update(termId, {$set: {deletedOn: new Date()}});
		weekIds.forEach(function(weekId) {
			Weeks.update(weekId, {$set: {deletedOn: new Date()}});
		});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	},

	batchUpdateTerms: function(termProperties) {
		termProperties.forEach(function(term, index) {
			Terms.update(term._id, {$set: term});
		});
	},

	batchRemoveTerms: function(termIds) {
		termIds.forEach(function(termId, index) {
			Terms.remove(termId);
		});
	},
})