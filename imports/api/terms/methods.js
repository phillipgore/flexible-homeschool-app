import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Terms} from './terms.js';

Meteor.methods({
	insertTerm(termProperties) {
		termProperties.forEach(function(term) {
			Terms.insert(term);
		})
	},

	updateTerm: function(termId, termProperties) {
		Terms.update(termId, {$set: termProperties});
	},

	archiveTerm: function(termId) {
		Terms.update(termId, {$set: {archive: true}});
	}
})