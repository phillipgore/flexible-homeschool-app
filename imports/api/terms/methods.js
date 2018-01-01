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
		Terms.update(termId, {$set: {deleted: true}});
	}
})