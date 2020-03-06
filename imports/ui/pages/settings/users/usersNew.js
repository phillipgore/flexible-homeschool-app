import {Template} from 'meteor/templating';
import './usersNew.html';

import md5 from 'md5';

Template.usersNew.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
	Session.setPersistent('unScrolled', true);
});

Template.usersNew.onRendered( function() {	
	let template = Template.instance();

	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	}

	Session.set({
		toolbarType: 'new',
		labelThree: 'New User',
		
		
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
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);
	
			const userProperties = {
				email: template.find("[name='email']").value.trim(),
				password: template.find("[name='password']").value.trim(),
				info: {
					firstName: template.find("[name='firstName']").value.trim(),
					lastName: template.find("[name='lastName']").value.trim(),
					relationshipToStudents: template.find("[name='relationshipToStudents']").value.trim(),
					role: template.find("[name='role']:checked").value.trim(),
					groupId: template.find("[name='groupId']").value.trim(),
				},
				status: {
					active: true,
					updatedOn: new Date(),
				}
			};

			let mcSubscriptionProperties = {
				email: template.find("[name='email']").value.trim(),
				emailHash: md5(template.find("[name='email']").value.trim()),
				firstName: template.find("[name='firstName']").value.trim(),
				lastName: template.find("[name='lastName']").value.trim()
			};

			Meteor.call('insertUser', userProperties, function(error, userId) {
				if (error) {
					if (error.reason != 'unverified') {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
					
						$('.js-saving').hide();
						$('.js-submit').prop('disabled', false);
					}
				} else {
					Meteor.call('sendVerificationEmail', userId, userProperties.email, function(error, result) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'icn-danger',
								message: error.reason,
							});
						} else {
							Meteor.call('mcSubscription', mcSubscriptionProperties, function(error, result) {
						    	FlowRouter.go('/settings/users/view/3/' + userId);
								Alerts.insert({
									colorClass: 'bg-info',
									iconClass: 'icn-email',
									message: 'We sent ' + userProperties.info.firstName +' '+ userProperties.info.lastName + ' an email with a verification link. It may take a few minutes for the email to arrive.',
								});
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
		{label: 'I Am An Only Child - Boy', value: 'Only Boy'},
		{label: 'I Am An Only Child - Girl', value: 'Only Girl'},
		{label: 'I Am An Unrelated Male', value: 'Unrelated Male'},
		{label: 'I Am An Unrelated Female', value: 'Unrelated Female'},
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

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/settings/users/view/3/' + Session.get('selectedUserId'));
		} else {
			FlowRouter.go('/settings/users/view/2/' + Session.get('selectedUserId'));
		}
		
	},
});