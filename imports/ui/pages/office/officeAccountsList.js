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

	users: function() {
		console.log(Meteor.users.find({'info.role': 'Administrator'}, {sort: {createdAt: 1}}).fetch())
		return Meteor.users.find({'info.role': 'Administrator'}, {sort: {createdAt: 1}});
	},

	online: function(status) {
		console.log(status)
		if (status === 'online') {
			return true;
		} 
		return false;
	},

	subscriptionStatus: function (groupId) {
		let subscriptionStatus = Groups.findOne({_id: groupId}).subscriptionStatus;
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

	active: function(groupId) {
		if (FlowRouter.getParam('selectedGroupId') === groupId) {
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