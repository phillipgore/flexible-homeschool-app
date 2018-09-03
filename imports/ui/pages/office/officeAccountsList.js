import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	// Subscriptions
	this.accountData = Meteor.subscribe('allAccounts');
});

Template.officeAccountsList.onRendered( function() {
	Session.set({
		labelOne: 'Accounts',
	});
});

Template.officeAccountsList.helpers({
	subscriptionReady: function() {
		return Template.instance().accountData.ready();
	},
	
	groups: function() {
		return Groups.find({appAdmin: false}, {sort: {createdOn: -1}});
	},

	subscriptionStatus: function (subscriptionStatus) {
		if (subscriptionStatus === 'pausePending') {
			return 'txt-warning';
		}
		if (subscriptionStatus === 'paused') {
			return 'txt-gray-darker';
		}
		if (subscriptionStatus === 'error') {
			return 'txt-danger';
		}
		return 'txt-info';
	},
});