import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	let template = Template.instance();

	template.autorun(() => {
		this.allAccounts = Meteor.subscribe('allAccounts');
	});
});

Template.officeAccountsList.onRendered( function() {
	Session.set({
		labelOne: 'Accounts',
	});
});

Template.officeAccountsList.helpers({
	subscriptionReady: function() {
		if (Template.instance().allAccounts.ready()) {
			return true;
		}
		return false;
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
		if (subscriptionStatus === 'freeTrial') {
			return 'txt-royal';
		}
		if (subscriptionStatus === 'freeTrialExpired') {
			return 'txt-royal expired';
		}
		return 'txt-info';
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedGroupId') === id) {
			return true;
		}
		return false;
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},
});