import {Template} from 'meteor/templating';
import './usersView.html';

Template.usersView.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		toolbarType: 'user',
		editUrl: '/settings/users/edit/' + FlowRouter.getParam('selectedUserId'),
		labelThree: 'User',
		activeNav: 'settingsList',
	});
});

Template.usersView.helpers({
	user: function() {
		return Meteor.users.findOne({_id: FlowRouter.getParam('selectedUserId')});
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

		if (Meteor.users.findOne({_id: FlowRouter.getParam('selectedUserId')}).info.role === 'Administrator') {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: 'Administrators cannot be paused.',
			});
			return false;
		}
		
		Meteor.call('pauseUser', FlowRouter.getParam('selectedUserId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'fss-info',
					message: 'This User has been paused. They will no longer have access to the app. You may upause them at any time.',
				});
			}
		});
	},

	'click .js-unpause-user'(event) {
		event.preventDefault();
		
		Meteor.call('unpauseUser', FlowRouter.getParam('selectedUserId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'fss-info',
					message: 'This User has been unpaused. They now have access to the app. You may pause them again at any time.',
				});
			}
		});
	},

	'click .js-delete-user-confirmed'(event) {
		event.preventDefault();
		$('.loading-deleting').show();

		let dialogId = Dialogs.findOne()._id;
		let nextUserId = Meteor.users.findOne({'emails.0.verified': true, 'status.active': true})._id

		Dialogs.remove({_id: dialogId});
		Meteor.call('removeUser', FlowRouter.getParam('selectedUserId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				Session.set('selectedUserId', nextUserId);
				FlowRouter.go('/settings/users/view/' + nextUserId);
				$('.loading-deleting').hide();
			}
		});
	},

	'click .js-resend-verificatin-email'(event) {
		event.preventDefault();
		$('.loading-sending').show();

		let userId = $(event.currentTarget).attr('id');
		let emailAddress = $(event.currentTarget).attr('data-user-email');

		Meteor.call('resendVerificationEmail', userId, emailAddress, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'fss-email',
					message: 'We resent this user an email with a verification link.',
				});
				$('.loading-sending').hide();
			}
		});
	},
});





