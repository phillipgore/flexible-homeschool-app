import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from './groups.js';
import {Lessons} from '../lessons/lessons.js';
import {primaryInitialIds} from '../../modules/server/initialIds';

Meteor.methods({
	getInitialGroupIds: function() {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let group = Groups.findOne({_id: groupId});

		if (group.appAdmin) {
			let groups = Groups.find({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}).fetch();
			let onlineUsersGroupIds = Meteor.users.find({'presence.status': 'online'}).map(user => user.info.groupId)
			
			let initialGroupIds = {
				all: 'empty',
				online: 'empty',
				active: 'empty',
				pausePending: 'empty',
				paused: 'empty',
				error: 'empty',
				freeTrial: 'empty',
				freeTrialExpired: 'empty',
			}

			let all = groups[0];
			console.log(!_.isUndefined(all));
			if (!_.isUndefined(all)) {initialGroupIds.all = all._id}

			let online = _.filter(groups, group => _.includes(onlineUsersGroupIds, group._id));
			console.log(online.length);
			if (online.length) {initialGroupIds.online = _.orderBy(online[0]._id, ['createdOn'], ['desc'])};

			let active = _.find(groups, ['subscriptionStatus', 'active']);
			console.log(!_.isUndefined(active));
			if (!_.isUndefined(active)) {initialGroupIds.active = active._id};

			let pausePending = _.find(groups, ['subscriptionStatus', 'pausePending']);
			console.log(!_.isUndefined(pausePending));
			if (!_.isUndefined(pausePending)) {initialGroupIds.pausePending = pausePending._id};

			let paused = _.find(groups, ['subscriptionStatus', 'paused']);
			console.log(!_.isUndefined(paused));
			if (!_.isUndefined(paused)) {initialGroupIds.paused = paused._id};

			let error = _.find(groups, ['subscriptionStatus', 'error']);
			console.log(!_.isUndefined(error));
			if (!_.isUndefined(error)) {initialGroupIds.error = error._id};

			let freeTrial = _.find(groups, ['subscriptionStatus', 'freeTrial']);
			console.log(!_.isUndefined(freeTrial));
			if (!_.isUndefined(freeTrial)) {initialGroupIds.freeTrial = freeTrial._id};

			let freeTrialExpired = _.find(groups, ['subscriptionStatus', 'freeTrialExpired']);
			console.log(!_.isUndefined(freeTrialExpired));
			if (!_.isUndefined(freeTrialExpired)) {initialGroupIds.freeTrialExpired = freeTrialExpired._id};

			console.log(initialGroupIds)
			return initialGroupIds;
		}
			
		return false;
	},

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
		Groups.update(groupProperties._id, {$set: groupProperties}, function() {
			Meteor.call('mcTags', groupProperties._id);
		});
	},

	runPrimaryInitialIds: function() {
		primaryInitialIds();
	}
})