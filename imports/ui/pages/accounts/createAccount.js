import {Template} from 'meteor/templating';
import Stripe from '../../../modules/stripe';
import {cardValidation, emailValidation, passwordValidation, requiredValidation} from '../../../modules/functions';
import './createAccount.html';

Template.createAccount.onCreated( function() {
	// Subscriptions
	this.subscribe('allPlans');
});

Template.createAccount.onRendered( function() {	
	
});

Template.createAccount.helpers({
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

Template.createAccount.events({
	'submit .js-form-create-account'(event) {
		event.preventDefault();

		let groupProperties = {
			subscriptionStatus: 'pending',
		}

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

		let subscriptionProperties = {
			customer: {
				email: user.email,
				metadata: {
					groupId: null,
				}
			},
			subscription: {
				customer: null,
				items: [{plan: 'standard'}],
			},
		}

		if (event.target.coupon.value.trim() != '') {
			subscriptionProperties.subscription.coupon = event.target.coupon.value.trim()
		}

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

		if (requiredValidation(subscriptionProperties.customer.email)) {
			$('#email').removeClass('error');
			$('.email-errors').text('');

			if (emailValidation(subscriptionProperties.customer.email)) {
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

		
		if (cardValidation() && accountForm.indexOf(false) === -1) {
			Meteor.call('insertGroup', groupProperties, function(error, groupId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
				} else {
					user.info.groupId = groupId;
					subscriptionProperties.customer.metadata.groupId = groupId;
					
					Accounts.createUser(user, function(error) {
						if (error && error.reason != 'unverified') {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
						} else { 
							stripe.createToken(Session.get('cardNumber')).then((result) => {
								if (result.error) {
									FlowRouter.go('/verify/sent');
								} else {
									let cardId = result.token.card.id
									subscriptionProperties.customer.source = result.token.id;
									Meteor.call('createSubscription', subscriptionProperties, function(error, updatedGroupProperties) {
										if (error) {
											Alerts.insert({
												colorClass: 'bg-danger',
												iconClass: 'fss-danger',
												message: error.reason,
											});
										} else {
											updatedGroupProperties.stripeCardId = cardId
											Meteor.call('updateGroup', groupId, updatedGroupProperties, function(error) {
												if (error) {
													Alerts.insert({
														colorClass: 'bg-danger',
														iconClass: 'fss-danger',
														message: error.reason,
													});
												} else {
													FlowRouter.go('/verify/sent');
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});

			return false;
		}
	},
});