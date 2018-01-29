import {Template} from 'meteor/templating';
import './usersList.html';

Template.usersList.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
});

Template.usersList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/settings/list',
		leftIcon: 'fss-back',
		label: 'Users',
		rightUrl: '/settings/users/new',
		rightIcon: 'fss-new',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.usersList.helpers({
	users: function() {
		return Meteor.users.find({'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	},

	usersPending: function() {
		return Meteor.users.find({'emails.0.verified': false}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	},
	
	usersPaused: function() {
		return Meteor.users.find({'emails.0.verified': true, 'status.active': false}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	},

	gender: function(relationship) {
		if (relationship === 'Mom' || relationship === 'Sister' || relationship === 'Grandma' || relationship === 'Aunt' || relationship === 'Teacher') {
			return 'fss-users-female';
		}
		return 'fss-users';
	},
});