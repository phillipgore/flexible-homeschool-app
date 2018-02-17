import {Template} from 'meteor/templating';
import './usersView.html';

Template.usersView.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
});

Template.usersView.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		leftUrl: '/settings/users/list',
		leftIcon: 'fss-back',
		label: '',
		editUrl: '/settings/users/edit/' + FlowRouter.getParam('id'),
	});

	if ( !Meteor.users.findOne({_id: FlowRouter.getParam('id')}).status.active ) {
		Session.set({
			deleteClass: '',
			pauseClass: '',
			unpauseClass: 'js-unpause-user',
		});
	} else if ( Meteor.users.findOne( {_id: FlowRouter.getParam('id')} ).emails[0].verified ) {
		Session.set({
			deleteClass: '',
			pauseClass: 'js-pause-user',
			unpauseClass: '',
		});
	} else {
		Session.set({
			deleteClass: 'js-delete-user',
			pauseClass: '',
			unpauseClass: '',
		});
	}

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.usersView.helpers({
	user: function() {
		return Meteor.users.findOne({_id: FlowRouter.getParam('id')});
	},

	verified: function(verified) {
		if (verified) {
			return 'Yes';
		}
		return 'No';
	},
});

Template.usersView.events({
	'click .js-pause-user'(event) {
		event.preventDefault();

		if (Meteor.users.find().count() === 1) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: 'You must have at least one active user.',
			});
			return false;
		}

		if (Meteor.users.findOne({_id: FlowRouter.getParam('id')}).info.role === 'Administrator') {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: 'Administrators cannot be paused.',
			});
			return false;
		}
		
		Meteor.call('pauseUser', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go('/settings/users/list');
			}
		});
	},

	'click .js-unpause-user'(event) {
		event.preventDefault();
		
		Meteor.call('unpauseUser', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go('/settings/users/list');
			}
		});
	},

	'click .js-delete-user'(event) {
		event.preventDefault();
		
		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this User?',
			confirmClass: 'js-delete-user-confirmed',
		});
	},

	'click .js-delete-user-confirmed'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
		Meteor.call('removeUser', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				FlowRouter.go('/settings/users/list');
			}
		});
	}
});





