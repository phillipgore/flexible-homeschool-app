import {Template} from 'meteor/templating';
import Stripe from '../../../modules/stripe';
import {cardValidation, emailValidation, passwordValidation, requiredValidation} from '../../../modules/functions';
import './createAccount.html';

import moment from 'moment';

Template.createAccount.onCreated( function() {
	
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

	firstBillingDate: function() {
		return moment().add(30, 'days');;
	},

});

Template.createAccount.events({
	'click .js-billing-info'(event) {
		event.preventDefault();

		if (Alerts.findOne({_id: 'cc-info'})) {
			Alerts.remove({_id: 'cc-info'})
		} else {
			Alerts.insert({
				_id: 'cc-info',
				colorClass: 'bg-info',
				iconClass: 'fss-info',
				message: '<div class="p-tn-tb-6"><p class="line-height-1-75 m-tn-b-15">We ask for your credit card to allow your membership to continue after your free trial, should you choose not to pause your account.</p> <p class="line-height-1-75 m-tn-b-15">This also allows us to reduce fraud and prevent multiple free trials for one person which helps us deliver quality service for honest customers.</p> <p class="line-height-1-75">Your credit card will not be charged at any point of your free trial. You can cancel anytime. We’ll even send you an email three days before your trial is over to remind you it’s about to expire.</p></div>',
			});
		}
	},

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

		let subscriptionProperties = {
			customer: {
				email: user.email,
				metadata: {
					groupId: null,
				}
			},
			subscription: {
				customer: null,
				items: [{plan: Meteor.settings.public.stripePlanId}],
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
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);
			Meteor.call('insertGroup', function(error, groupId) {
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
					subscriptionProperties.customer.metadata.groupId = groupId;
					
					Accounts.createUser(user, function(error) {
						if (error && error.reason != 'unverified') {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
					
							$('.js-saving').hide();
							$('.js-submit').prop('disabled', false);
						} else { 
							stripe.createToken(Session.get('cardNumber')).then((result) => {
								if (result.error) {
									FlowRouter.go('/verify/sent');
								} else {
									subscriptionProperties.customer.source = result.token.id;
									Meteor.call('createSubscription', groupId, result.token.card.id, subscriptionProperties, function(error, updatedGroupProperties) {
										if (error) {
											Alerts.insert({
												colorClass: 'bg-danger',
												iconClass: 'fss-danger',
												message: error.reason,
											});
					
											$('.js-saving').hide();
											$('.js-submit').prop('disabled', false);
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

			return false;
		}
	},
});