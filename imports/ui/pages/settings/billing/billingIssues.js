import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import './billingIssues.html';

Template.billingIssues.onCreated( function() {
	// Subscriptions
	this.subscribe('groupStatus');
	this.subscribe('signedInUser');
});

Template.billingIssues.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Billing Issues',
		rightUrl: '',
		rightIcon: '',
	});

	$('.js-form-update-credit-card').validate({
		rules: {
			creditCard: { required: true, creditcard: true },
			cvc: { required: true, digits: true, minlength: 3, maxlength: 3 },
		},
		messages: {
			creditCardNumber: { required: "Required.", creditcard: "Please enter a valid credit card." },
			creditCardCvc: { required: "Required.", digits: "Invalid.", minlength: "Invalid.", maxlength: "Invalid." },
		},
		submitHandler() {	
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

			stripe.createToken(Session.get('cardNumber')).then((result) => {
				if (!result.error) {
					subscriptionProperties.customer.source = result.token.id;
					Meteor.call('createSubscription', subscriptionProperties, function(error, updatedGroupProperties) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
						} else {
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

			return false;
		}
	});
});

Template.billingIssues.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.billingIssues.events({
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
	},
});