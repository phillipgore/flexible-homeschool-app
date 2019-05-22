import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {upsertPaths} from '../../modules/server/paths';
import {upsertSchoolWorkPaths} from '../../modules/server/paths';

Meteor.methods({
	runUpsertPaths: function(pathProperties, isNew) {
		let result = upsertPaths(pathProperties, isNew);
		return result;
	},

	runUpsertSchoolWorkPaths: function(pathProperties, submittedGroupId) {
		upsertSchoolWorkPaths(pathProperties, submittedGroupId);
	},
});