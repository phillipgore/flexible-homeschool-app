import {Template} from 'meteor/templating';
import './usersEdit.html';

Template.usersEdit.onCreated( function() {
	// Subscriptions
	this.subscribe('allUsers');
});

Template.usersEdit.onRendered( function() {
	let template = Template.instance();

	// Toolbar Settings
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit User',
		
		
		activeNav: 'settingsList',
	});

	$('.js-form-edit-user').validate({
		rules: {
			firstName: { required: true },
			lastName: { required: true },
			email: { required: true, email: true },
		},
		messages: {
			firstName: { required: "Required." },
			lastName: { required: "Required." },
			email: { required: "Required.", email: "Please enter a valid email address." },
		},
		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);
	
			let userProperties = {
				"emails.0.address": template.find("[name='email']").value.trim(),
				info: {
					firstName: template.find("[name='firstName']").value.trim(),
					lastName: template.find("[name='lastName']").value.trim(),
					relationshipToStudents: template.find("[name='relationshipToStudents']").value.trim(),
					role: template.find("[name='role']:checked").value.trim(),
					groupId: template.find("[name='groupId']").value.trim(),
				},
			};

			let subscriptionProperties = {
				email: template.find("[name='email']").value.trim(),
				firstName: template.find("[name='firstName']").value.trim(),
				lastName: template.find("[name='lastName']").value.trim()
			};

			Meteor.call('updateUser', FlowRouter.getParam('selectedUserId'), userProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Meteor.call('mailChimpSubscriptions', subscriptionProperties, function(error, result) {
				    	FlowRouter.go('/settings/users/view/3/' + FlowRouter.getParam('selectedUserId'));
				    });
				}
			});

			return false;
		}
	});
});

Template.usersEdit.helpers({
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

	user: function() {
		return Meteor.users.findOne({_id: FlowRouter.getParam('selectedUserId')});
	},

	activeRelationship: function(currentRelationship, relationship) {
		if (currentRelationship === relationship) {
			return true;
		}
		return false;
	},

	role: function(currentRole, role) {
		if (currentRole === role) {
			return true;
		}
		return false;
	},

	disabled: function() {
		if (Meteor.users.find({'emails.0.verified': true}).count() > 1) {
			return false;
		}
		return true;
	},

	cancelPath: function() {
		return '/settings/users/view/3/' + FlowRouter.getParam('selectedUserId');
	},
});

Template.usersEdit.events({
	'submit .js-form-edit-user'(event) {
		event.preventDefault();
	},
});

