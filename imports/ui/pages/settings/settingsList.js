import {Template} from 'meteor/templating';
import './settingsList.html';

Template.settingsList.onCreated( function() {
	// Subscriptions
	this.subscribe('signedInUser');
	this.subscribe('group');
});

Template.settingsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Settings',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.settingsList.helpers({
	items: [
		{divider: false, classes: '', icon: 'fss-users', label: 'Users', url: '/settings/users/list'},
		{divider: false, classes: '', icon: 'fss-billing', label: 'Billing', url: '/settings/billing/list'},
		{divider: false, classes: '', icon: 'fss-support', label: 'Support', url: '/support'},
	],

	user: function() {
		return Meteor.users.findOne();
	},

	test: function() {
		return Session.get('card').brand;
	}
});

Template.settingsList.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});