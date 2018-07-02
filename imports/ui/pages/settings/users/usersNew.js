import {Template} from 'meteor/templating';
import './usersNew.html';

Template.usersNew.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
});

Template.usersNew.onRendered( function() {
	Session.set({
		toolbarType: 'new',
		labelThree: 'New User',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'settingsList',
	});

	$('.js-form-new-user').validate({
		rules: {
			firstName: { required: true },
			lastName: { required: true },
			email: { required: true, email: true },
			password: { required: true },
			retypePassword: { required: true, equalTo: "#password" },
		},
		messages: {
			firstName: { required: "Required." },
			lastName: { required: "Required." },
			email: { required: "Required.", email: "Please enter a valid email address." },
			password: { required: "Required." },
			retypePassword: { required: "Required.", equalTo: "Passwords do not match." },
		},
		submitHandler() {
			$('.loading-saving').show();
			$('.js-submit').prop('disabled', true);
	
			const userProperties = {
				email: event.target.email.value.trim(),
				password: event.target.password.value.trim(),
				info: {
					firstName: event.target.firstName.value.trim(),
					lastName: event.target.lastName.value.trim(),
					relationshipToStudents: event.target.relationshipToStudents.value.trim(),
					role: event.target.role.value.trim(),
					groupId: event.target.groupId.value.trim(),
				},
				status: {
					active: true,
					updatedOn: new Date(),
				}
			}

			Meteor.call('insertUser', userProperties, function(error, userId) {
				if (error) {
					if (error.reason != 'unverified') {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
					
						$('.js-loading').hide();
						$('.js-submit').prop('disabled', false);
					}
				} else {
					Meteor.call('sendVerificationEmail', userId, userProperties.email, function(error, result) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
						} else {
							FlowRouter.go('/settings/users/view/' + userId);
							Alerts.insert({
								colorClass: 'bg-info',
								iconClass: 'fss-email',
								message: 'We sent ' + userProperties.info.firstName +' '+ userProperties.info.lastName + ' an email with a verification link. It may take a few minutes for the email to arrive.',
							});
						}
					});
				}
			});

			return false;
		}
	});
});

Template.usersNew.helpers({
	relationships: [
		{label: 'I Am Mom', value: 'Mom'},
		{label: 'I Am Dad', value: 'Dad'},
		{label: 'I Am Brother', value: 'Brother'},
		{label: 'I Am Sister', value: 'Sister'},
		{label: 'I Am Tutor', value: 'Tutor'},
		{label: 'I Am Teacher', value: 'Teacher'},
		{label: 'I Am Grandma', value: 'Grandma'},
		{label: 'I Am Grandpa', value: 'Grandpa'},
		{label: 'I Am Aunt', value: 'Aunt'},
		{label: 'I Am Uncle', value: 'Uncle'},
	],

	groupId: function() {
		return Meteor.users.findOne().info.groupId;
	},

	selectedUserId: function() {
		return Session.get('selectedUserId');
	},
});

Template.usersNew.events({
	'submit .js-form-new-user'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();
		
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');
		FlowRouter.go('/settings/users/view/' + Session.get('selectedUserId'));
	},
});