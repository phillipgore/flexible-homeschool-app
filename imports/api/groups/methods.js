import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from './groups.js';

Meteor.methods({
	insertGroup(groupProperties) {
		let groupId = Groups.insert(groupProperties);
		return groupId;
	},

	updateGroup: function(groupId, groupProperties) {
		Groups.update(groupId, {$set: groupProperties});
	},

	pauseGroup: function(groupId) {
		Groups.update(groupId, {$set: {pause: true}});
	},

	unpauseGroup: function(groupId) {
		Groups.update(groupId, {$set: {pause: false}});
	}
})