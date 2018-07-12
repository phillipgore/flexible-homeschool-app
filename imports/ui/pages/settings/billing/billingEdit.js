import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import {cardValidation} from '../../../../modules/functions';
import './billingEdit.html';

Template.billingEdit.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});
});

Template.billingEdit.onRendered( function() {
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Payment',
		activeNav: 'settingsList',
	});

	Session.set('hideCoupon', true)
});

Template.billingEdit.helpers({
	subscriptionReady: function() {
		return Template.instance().groupData.ready();
	},

	user: function() {
		return Meteor.users.findOne();
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.billingEdit.events({
	'click .js-cancel'(event) {
		event.preventDefault();

		FlowRouter.go('/settings/billing/invoices/2');
	},

	'submit .js-form-update-credit-card'(event) {
		event.preventDefault();
		$('.js-updating').show();
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
					
					$('.js-updating').hide();
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
						} else {
							Meteor.call('getCard', function(error, result) {
								if (error) {
									Alerts.insert({
										colorClass: 'bg-danger',
										iconClass: 'fss-danger',
										message: error.reason,
									});
								} else {
									Session.set('card', result);
									FlowRouter.go('/settings/billing/invoices/2');

									$('.js-updating').hide();
									$('.js-submit').prop('disabled', false);
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
			});
		}
	},
});