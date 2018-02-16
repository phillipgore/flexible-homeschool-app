import {Template} from 'meteor/templating';
import './usersNew.html';

Template.usersNew.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
});

Template.usersNew.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'New User',
		rightUrl: '',
		rightIcon: '',
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
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);
	
			const user = {
				email: event.target.email.value.trim(),
				password: event.target.password.value.trim(),
				info: {
					firstName: event.target.firstName.value.trim(),
					lastName: event.target.lastName.value.trim(),
					relationshipToStudents: event.target.relationshipToStudents.value.trim(),
					role: event.target.role.value.trim(),
				},
				group: {
					groupId: event.target.groupId.value.trim(),
				},
				status: {
					active: true,
					updatedOn: new Date(),
				}
			}

			Accounts.createUser(user, function(error) {
				if (error) {
					if (error.reason === 'unverified') {
						FlowRouter.go('/settings/users/verify/sent');
					} else {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
					
						$('.js-loading').hide();
						$('.js-submit').prop('disabled', false);
					}
				} else {
					FlowRouter.go('/settings/users/verify/sent');
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
	}
});

Template.usersNew.events({
	'submit .js-form-new-user'(event) {
		event.preventDefault();
	},
});