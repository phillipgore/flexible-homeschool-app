import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {upsertStats} from '../../modules/server/stats';


Meteor.methods({
	runUpsertStats: function(statProperties, submittedGroupId) {
		upsertStats(statProperties, submittedGroupId);
	}
})