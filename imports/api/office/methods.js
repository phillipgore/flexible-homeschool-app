import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from '../groups/groups.js';
import {groupsInitialId} from '../../modules/server/initialIds';

import _ from 'lodash'

Meteor.methods({
	runGroupsInitialId: function() {
		let appAdminId = Groups.findOne({appAdmin: true})._id
		groupsInitialId(appAdminId);
	}
});