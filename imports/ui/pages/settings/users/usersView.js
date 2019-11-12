import {Template} from 'meteor/templating';
import './usersView.html';

Template.usersView.onRendered( function() {
	DocHead.setTitle('Settings: Users: View');

	// ToolbarView Settings
	Session.set({
		toolbarType: 'user',
		editUrl: '/settings/users/edit/3/' + FlowRouter.getParam('selectedUserId'),
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
				iconClass: 'icn-danger',
				message: 'You must have at least one active user.',
			});
			return false;
		}

		if (Meteor.users.findOne({_id: FlowRouter.getParam('selectedUserId')}).info.role === 'Administrator') {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'icn-danger',
				message: 'Administrators cannot be paused.',
			});
			return false;
		}
		
		Meteor.call('pauseUser', FlowRouter.getParam('selectedUserId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'icn-info',
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
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'icn-info',
					message: 'This User has been unpaused. They now have access to the app. You may pause them again at any time.',
				});
			}
		});
	},

	'click .js-resend-verificatin-email'(event) {
		event.preventDefault();
		$('.js-sending').show();

		let userId = $(event.currentTarget).attr('id');
		let emailAddress = $(event.currentTarget).attr('data-user-email');
		let userName = $(event.currentTarget).attr('data-user-name');

		Meteor.call('sendVerificationEmail', userId, emailAddress, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'icn-email',
					message: 'We resent ' + userName + ' an email with a verification link. It may take a few minutes for the email to arrive.',
				});
				$('.js-sending').hide();
			}
		});
	},
});





