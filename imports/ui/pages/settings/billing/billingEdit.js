import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import {cardValidation} from '../../../../modules/functions';
import './billingEdit.html';

Template.billingEdit.onCreated( function() {
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

Template.billingEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		label: 'Edit Payment',
		rightUrl: '',
		rightIcon: '',
	});

	Session.set('hideCoupon', true)
});

Template.billingEdit.helpers({
	dataReady: function() {
		if (Session.get('card') && Groups.findOne({})) {
			return true;
		}
		return false;
	},

	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},

	attemptMessage: function(attempts) {
		if (attempts === 1) {
			return 'We have made a failed attempt to charge your card. You may need to update your payment information.'
		}
		if (attempts === 2) {
			return 'We have made two failed attempts to charge your card. Please update your payment information.'
		}
		if (attempts === 3) {
			return 'We have made three failed attempts to charge your card. Please update your payment information.'
		}
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

Template.billingEdit.events({
	'submit .js-form-update-credit-card'(event) {
		event.preventDefault();
		$('.js-loading').show();
		$('.js-submit').prop('disabled', true);

		let groupId = event.target.groupId.value.trim();

		if (cardValidation()) {
			stripe.createToken(Session.get('cardNumber')).then((result) => {
				if (result.error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: result.error,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					let cardId = result.token.card.id;
					Meteor.call('updateCard', result.token.id, function(error, result) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
					
							$('.js-loading').hide();
							$('.js-submit').prop('disabled', false);
						} else {
							FlowRouter.go('/settings/billing/list');
							Alerts.insert({
								colorClass: 'bg-info',
								iconClass: 'fss-info',
								message: 'Your card has been updated.',
							});
						}
					});
				}
			});
		}
	},
});