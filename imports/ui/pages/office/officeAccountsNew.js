import {Template} from 'meteor/templating';
import {emailValidation, passwordValidation, requiredValidation} from '../../../modules/functions';

import moment from 'moment';
import _ from 'lodash'
import './officeAccountsNew.html';

Template.officeAccountsNew.onCreated( function() {
	
});

Template.officeAccountsNew.onRendered( function() {	
	$('#free-trial-expiration').pickadate({
		format: 'mmmm d, yyyy',
		today: 'Today',
		clear: 'Clear',
		close: 'Close',
	});
});

Template.officeAccountsNew.helpers({
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
});

Template.officeAccountsNew.events({
	'submit .js-form-create-account'(event) {
		event.preventDefault();

		let user = {
			email: event.target.email.value.trim(),
			password: event.target.password.value.trim(),
			info: {
				firstName: event.target.firstName.value.trim(),
				lastName: event.target.lastName.value.trim(),
				relationshipToStudents: event.target.relationshipToStudents.value.trim(),
				role: 'Administrator',
				groupId: null,
			},
			status: {
				active: true,
				updatedOn: new Date(),
			}
		}

		let freeTrialExpiration = event.currentTarget.freeTrialExpiration.value.trim();
		console.log(user)
		console.log(freeTrialExpiration)
		return false

		let accountForm = [];
		let passwordsPresent = [];
		if (requiredValidation(user.info.firstName)) {
			$('#first-name').removeClass('error');
			$('.first-name-errors').text('');
		} else {
			$('#first-name').addClass('error');
			$('.first-name-errors').text('Required.');
			accountForm.push(false);
		}

		if (requiredValidation(user.info.lastName)) {
			$('#last-name').removeClass('error');
			$('.last-name-errors').text('');
		} else {
			$('#last-name').addClass('error');
			$('.last-name-errors').text('Required.');
			accountForm.push(false);
		}

		if (requiredValidation(user.email)) {
			$('#email').removeClass('error');
			$('.email-errors').text('');

			if (emailValidation(user.email)) {
				$('#email').removeClass('error');
				$('.email-errors').text('');
			} else {
				$('#email').addClass('error');
				$('.email-errors').text('Please enter a valid email address.');
				accountForm.push(false);
			}

		} else {
			$('#email').addClass('error');
			$('.email-errors').text('Required.');
			accountForm.push(false);
		}

		if (requiredValidation(user.password)) {
			$('#password').removeClass('error');
			$('.password-errors').text('');
			passwordsPresent.push(true);
		} else {
			$('#password').addClass('error');
			$('.password-errors').text('Required.');
			accountForm.push(false);
		}

		if (requiredValidation(event.target.retypePassword.value.trim())) {
			$('#retype-password').removeClass('error');
			$('.retype-password-errors').text('');
			passwordsPresent.push(true);
		} else {
			$('#retype-password').addClass('error');
			$('.retype-password-errors').text('Required.');
			accountForm.push(false);
		}

		if (passwordsPresent.length === 2) {
			if (passwordValidation(user.password, event.target.retypePassword.value.trim())) {
				$('#password, #retype-password').removeClass('error');
				$('.password-errors, .retype-password-errors').text('');
			} else {
				$('#password, #retype-password').addClass('error');
				$('.password-errors, .retype-password-errors').text('Passwords must match.');
				accountForm.push(false);
			}
		}
		
		if (requiredValidation(freeTrialExpiration)) {
			$('#free-trial-expiration').removeClass('error');
			$('.free-trial-expiration-errors').text('');
		} else {
			$('#free-trial-expiration').addClass('error');
			$('.free-trial-expiration-errors').text('Required.');
			accountForm.push(false);
		}

		
		if (accountForm.indexOf(false) === -1) {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);
			Meteor.call('insertFreeTrial', user, function(error, groupId) {
				if (error && error.reason != 'unverified') {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
			
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else { 
					FlowRouter.go('/office/accounts/view/2/' + groupId);
				}
			})

			return false;
		}
	},
});