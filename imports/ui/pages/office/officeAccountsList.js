import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allAccounts');
});

Template.officeAccountsList.helpers({
	groups: function() {
		return Groups.find({appAdmin: false}, {sort: {createdOn: -1}});
	},

	accountPausedOrPending: function (subscriptionStatus) {
		if (subscriptionStatus === 'pausePending' || subscriptionStatus === 'paused') {
			return true;
		}
		return false;
	},

	accountPausePending: function (subscriptionStatus) {
		if (subscriptionStatus === 'pausePending') {
			return true;
		}
		return false;
	},

	accountPaused: function (subscriptionStatus) {
		if (subscriptionStatus === 'paused') {
			return true;
		}
		return false;
	},
});