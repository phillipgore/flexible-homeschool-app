import {Groups} from '../groups.js';
import {primaryInitialIds} from '../../../modules/server/initialIds';

Meteor.publish('group', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Groups.find({_id: groupId});
});

Meteor.publish('groupStatus', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	primaryInitialIds(groupId);
	return Groups.find({_id: groupId}, {fields: {subscriptionStatus: 1, stripePaymentAttempt: 1, initialIds: 1}});
});