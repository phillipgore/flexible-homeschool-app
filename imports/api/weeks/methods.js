import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Weeks} from './weeks.js';

Meteor.methods({
	insertWeeks(weekProperties) {
		weekProperties.forEach(function(week) {
			Weeks.insert(week);
		})
	},

	updateWeek: function(weekId, weekProperties) {
		Weeks.update(termId, {$set: termProperties});
	},

	archiveWeek: function(weekId) {
		Weeks.update(termId, {$set: {archive: true}});
	}
})