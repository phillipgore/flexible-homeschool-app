import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
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
	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},
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