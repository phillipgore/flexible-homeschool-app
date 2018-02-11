import {Template} from 'meteor/templating';
import './billingPaymentInfo.html';

Template.billingPaymentInfo.onCreated( function() {
	// Subscriptions
	this.subscribe('group');

	Meteor.call('getCard', function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: error.reason,
			});
		} else {
			Session.set('card', result);
		}
	})
});

Template.billingPaymentInfo.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/settings/billing/list',
		leftIcon: 'fss-back',
		label: 'Payment Info',
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
				card: {
					number: event.target.creditCardNumber.value.trim(),
					cvc: event.target.creditCardCvc.value.trim(),
					exp_month: parseInt(event.target.creditCardMonth.value.trim()),
					exp_year: parseInt(event.target.creditCardYear.value.trim()),
				},
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
							FlowRouter.go('/settings/billing/list');
						}
					});
				}
			});

			return false;
		}
	});
});

Template.billingPaymentInfo.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	card: function() {
		return Session.get('card');
	},

	cardClass: function() {
		if (!Session.get('card')) {
			return 'fss-billing';
		}
		let brand = Session.get('card').brand;		
		if (brand === 'Visa') {
			return 'fss-cc-visa';
		}
		if (brand === 'American Express') {
			return 'fss-cc-amex';
		}
		if (brand === 'MasterCard') {
			return 'fss-cc-master-card';
		}
		if (brand === 'Discover') {
			return 'fss-cc-discover';
		}
		if (brand === 'JCB') {
			return 'fss-cc-jcb';
		}
		if (brand === 'Diners Club') {
			return 'fss-cc-diners';
		}
		if (brand === 'Unknown') {
			return 'fss-billing';
		}
	},

	monthFormat: function(month) {
		if (!month.length) {
			return '0' + month;
		}
		return month;
	},
});

Template.billingPaymentInfo.events({
	'submit .js-form-update-credit-card'(event) {
		event.preventDefault();
	},
});