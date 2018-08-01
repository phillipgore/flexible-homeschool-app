import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from './groups.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertGroup: function(userEmail) {
		if (Accounts.findUserByEmail(userEmail)) {
			throw new Meteor.Error(500, 'Email already exists.');
		} else {
			let groupId = Groups.insert({subscriptionStatus: 'pending'});
			return groupId;
		}
	},

	updateGroup: function(groupProperties) {
		Groups.update(groupProperties._id, {$set: groupProperties});
	},

	pauseGroup: function(groupId) {
		Groups.update(groupId, {$set: {pause: true}});
	},

	unpauseGroup: function(groupId) {
		Groups.update(groupId, {$set: {pause: false}});
	}
})