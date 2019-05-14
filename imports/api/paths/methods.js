import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {upsertPaths} from '../../modules/server/paths';

Meteor.methods({
	runPathProperties: function(pathProperties, isNew) {
		let result = upsertPaths(pathProperties, isNew);
		return result;
	}
});