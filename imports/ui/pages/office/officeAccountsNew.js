import {Template} from 'meteor/templating';
import Stripe from '../../../modules/stripe';
import {cardValidation, emailValidation, passwordValidation, requiredValidation} from '../../../modules/functions';
import './officeAccountsNew.html';

import moment from 'moment';

Template.officeAccountsNew.onCreated( function() {
	
});

Template.officeAccountsNew.onRendered( function() {	
	Session.set('hideCoupon', false);
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

		// let subscriptionProperties = {
		// 	customer: {
		// 		email: user.email,
		// 		metadata: {
		// 			groupId: null,
		// 		}
		// 	},
		// 	subscription: {
		// 		customer: null,
		// 		items: [{plan: Meteor.settings.public.stripePlanId}],
		// 	},
		// }

		// if (event.target.coupon.value.trim().length) {
		// 	subscriptionProperties.subscription.coupon = event.target.coupon.value.trim();
		// } else {
		// 	subscriptionProperties.subscription.coupon = Meteor.settings.public.stripeSignUpDiscount;
		// }

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

		
		if (accountForm.indexOf(false) === -1) {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);
			Meteor.call('insertGroup', user.email, function(error, groupId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					user.info.groupId = groupId;
					
					Accounts.createUser(user, function(error) {
						if (error) {
							console.log(error);
						}
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
					});
				}
			});

			return false;
		}
	},
});