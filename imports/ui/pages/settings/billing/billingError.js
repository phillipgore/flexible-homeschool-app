import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Groups } from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import {cardValidation} from '../../../../modules/functions';
import './billingError.html';

Template.billingError.onCreated( function() {
	// Subscriptions
	this.subscribe('group');
	Session.set('validCoupon', true);
});

Template.billingError.onRendered( function() {
	// Toolbar Settings
	Session.set({
		labelOne: 'Billing Issues',
		labelTwo: 'Billing Issues',
		labelThree: 'Billing Issues',
		activeNav: 'settingsList',
	});
});

Template.billingError.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},

	freeTrialExpired: function(status) {
		if (status === 'freeTrialExpired') {
			return true;
		}
		return false;
	} 
});

Template.billingError.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},

	'submit .js-form-update-credit-card'(event) {
		event.preventDefault();

		let subscriptionProperties = {
			customer: {
				email: event.target.email.value.trim(),
				metadata: {
					groupId: event.target.groupId.value.trim(),
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

		Meteor.call('getCoupon', event.target.coupon.value.trim().toLowerCase(), function(error, result) {
			if (error && event.target.coupon.value.trim().length != 0) {
				$('#coupon').addClass('error');
				$('.coupon-errors').text('Invalid Coupon.');
				Session.set('validCoupon', false);
			} else {
				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);

				if (cardValidation()) {
					stripe.createToken(
						Session.get('cardNumber')
					).then((result) => {
						if (result.error) {
							FlowRouter.go('/settings/billing/error/1');
						} else {
							subscriptionProperties.customer.source = result.token.id;
							Meteor.call('createSubscription', subscriptionProperties.customer.metadata.groupId, result.token.card.id, subscriptionProperties, function(error, updatedGroupProperties) {
								if (error) {
									Alerts.insert({
										colorClass: 'bg-danger',
										iconClass: 'icn-danger',
										message: error.reason,
									});
							
									$('.js-updating').hide();
									$('.js-submit').prop('disabled', false);
								} else {
									FlowRouter.go('/');
								}
							});
						}
					}).catch((error) => {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.message,
						});
							
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
					});
				}
			}
		})
	},
});
















