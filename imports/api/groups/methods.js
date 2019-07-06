import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from './groups.js';
import {Lessons} from '../lessons/lessons.js';
import {primaryInitialIds} from '../../modules/server/initialIds';

Meteor.methods({
	getInitialGroupIds: function() {
		if (!this.userId) {
			return [];
		}

		let group = Meteor.users.findOne({_id: this.userId});

		if (group.appAdmin) {
			let groups = Groups.find({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}).fetch();
			let onlineUsersGroupIds = Meteor.find({'presence.status': 'online'}).map(user => user.info.groupId)
			
			_.filter(yearLessons, lesson => _.includes(termWeekIds, lesson.weekId)).map(lesson => lesson.schoolWorkId)

			// let all = groups[0];
			// let online = _.orderBy(_.filter(groups, group => _.includes(onlineUsersGroupIds, group._id)), ['createdOn'], ['desc'])[0]._id;
			// let active = _.find(groups, ['subscriptionStatus', 'active'])._id;
			// let pausePending = _.find(groups, ['subscriptionStatus', 'pausePending'])._id;
			// let paused = _.find(groups, ['subscriptionStatus', 'paused'])._id;
			// let error = _.find(groups, ['subscriptionStatus', 'error'])._id;
			// let freeTrial = _.find(groups, ['subscriptionStatus', 'freeTrial'])._id;
			// let freeTrialExpired = _.find(groups, ['subscriptionStatus', 'freeTrialExpired'])._id;

			let initialGroupIds = [{
				'all': groups[0],
				'online': _.orderBy(_.filter(groups, group => _.includes(onlineUsersGroupIds, group._id)), ['createdOn'], ['desc'])[0]._id,
				'active': _.find(groups, ['subscriptionStatus', 'active'])._id,
				'pausePending': _.find(groups, ['subscriptionStatus', 'pausePending'])._id,
				'paused': _.find(groups, ['subscriptionStatus', 'paused'])._id,
				'error': _.find(groups, ['subscriptionStatus', 'error'])._id,
				'freeTrial': _.find(groups, ['subscriptionStatus', 'freeTrial'])._id,
				'freeTrialExpired': _.find(groups, ['subscriptionStatus', 'freeTrialExpired'])._id,
			}];

			return initialGroupIds;
		}
			
		return [];
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