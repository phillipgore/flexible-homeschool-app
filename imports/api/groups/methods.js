import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from './groups.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertGroup: function(userEmail) {
		if (Accounts.findUserByEmail(userEmail)) {
			throw new Meteor.Error(500, 'Email already exists.');
		} else {
			groupProperties = {
				subscriptionStatus: 'pending', 
				initialIds: {
					studentId: 'empty',
					schoolYearId: 'empty',
					resourceId: 'empty',
					resourceType: 'empty',
					termId: 'empty',
					weekId: 'empty',
					schoolWorkId: 'empty',
					userId: 'empty',
					reportId: 'empty',
					groupId: 'empty',
				}
			}
			let groupId = Groups.insert(groupProperties);
			return groupId;
		}
	},

	updateGroup: function(groupProperties) {
		Groups.update(groupProperties._id, {$set: groupProperties});
	},

	// pauseGroup: function(groupId) {
	// 	Groups.update(groupId, {$set: {pause: true}});
	// },

	// unpauseGroup: function(groupId) {
	// 	Groups.update(groupId, {$set: {pause: false}});
	// }
})