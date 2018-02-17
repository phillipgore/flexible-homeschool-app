import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './settingsList.html';

Template.settingsList.onCreated( function() {
	// Subscriptions
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

	userRestricted: function(role) {
		if (role === 'Observer' || role === 'User') {
			return true;
		}
		return false;
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.settingsList.events({
	'click .js-restricted '(event) {
		let role = $(event.currentTarget).attr('data-role');
		let section = $(event.currentTarget).attr('data-section');
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'fss-info',
			message: 'The role of "' + role + '" is not allowed to access the ' + section + ' section.',
		});
	},

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