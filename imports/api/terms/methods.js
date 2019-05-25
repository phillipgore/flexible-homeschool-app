import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Terms} from './terms.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';

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

		Terms.remove({_id: termId});
		Weeks.remove({_id: {$in: weekIds}});
		Lessons.remove({_id: {$in: lessonIds}});
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