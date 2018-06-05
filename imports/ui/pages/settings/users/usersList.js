import {Template} from 'meteor/templating';
import './usersList.html';

Template.usersList.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
	Session.set('selectedUserId', FlowRouter.getParam('selectedUserId'));
});

Template.usersList.onRendered( function() {
	Session.set({
		toolbarType: 'user',
		labelTwo: 'Users',
		newUrl: '/settings/users/new/',
		activeNav: 'settingsList',
	});
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

	nonActive: function(pendingCount, pausedCount) {
		if (pendingCount || pausedCount) {
			return true;
		}
		return false;
	},

	gender: function(relationship) {
		if (relationship === 'Mom' || relationship === 'Sister' || relationship === 'Grandma' || relationship === 'Aunt' || relationship === 'Teacher') {
			return 'fss-users-female';
		}
		return 'fss-users';
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedUserId') === id) {
			return true;
		}
		return false;
	},
});








