import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Weeks} from './weeks.js';
import {primaryInitialIds} from '../../modules/server/initialIds';

Meteor.methods({
	batchInsertWeeks(weekProperties) {
		weekProperties.forEach(function(week) {
			Weeks.insert(week);
		});
	},

	bulkWriteWeeks: function(bulkWeekProperties) {
		Weeks.rawCollection().bulkWrite(bulkWeekProperties);
	},
})