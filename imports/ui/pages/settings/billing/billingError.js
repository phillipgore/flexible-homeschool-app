import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import {cardValidation} from '../../../../modules/functions';
import './billingError.html';

Template.billingError.onCreated( function() {
	// Subscriptions
	this.subscribe('group');
	this.subscribe('signedInUser');
});

Template.billingError.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Billing Issues',
		rightUrl: '',
		rightIcon: '',
	});
});

Template.billingError.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.billingError.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
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
				items: [{plan: 'standard'}],
			},
		}

		if (event.target.coupon.value.trim() != '') {
			subscriptionProperties.subscription.coupon = event.target.coupon.value.trim()
		}

		if (cardValidation()) {
			stripe.createToken(Session.get('cardNumber')).then((result) => {
				if (result.error) {
					FlowRouter.go('/settings/billing/issues');
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
							Meteor.call('updateGroup', subscriptionProperties.customer.metadata.groupId, updatedGroupProperties, function(error) {
								if (error) {
									Alerts.insert({
										colorClass: 'bg-danger',
										iconClass: 'fss-danger',
										message: error.reason,
									});
								} else {
									FlowRouter.go('/planning/list');
								}
							});
						}
					});
				}
			});
		}
	},
});
















