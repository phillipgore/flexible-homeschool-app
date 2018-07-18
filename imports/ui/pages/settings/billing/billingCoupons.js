import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import './billingCoupons.html';

Template.billingCoupons.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});
});


Template.billingCoupons.onRendered( function() {
	let template = Template.instance();

	Session.set({
		labelThree: 'Coupons',
		activeNav: 'settingsList',
		toolbarType: 'billing',
	});

	// Form Validation and Submission
	$('.js-form-apply-coupon-code').validate({
		rules: {
			coupon: { required: true },
		},
		messages: {
			coupon: { required: "Required." },
		},

		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			let stripeSubscriptionId = template.find("[name='stripeSubscriptionId']").value.trim()
			const subscriptionProperties = {
				coupon: template.find("[name='coupon']").value.trim(),
			}

			Meteor.call('updateSubscription', stripeSubscriptionId, subscriptionProperties, function(error, result) {
				console.log(result);
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/settings/billing/invoices/3');
					Alerts.insert({
						colorClass: 'bg-info',
						iconClass: 'fss-info',
						message: 'Coupon Code "' +subscriptionProperties.coupon+ '" has been applied to your account.',
					});
				}
			});

			return false;
		}
	});
});

Template.billingCoupons.helpers({
	subscriptionReady: function() {
		return Template.instance().groupData.ready();
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.billingCoupons.events({
	'submit .js-form-apply-coupon-code'(event) {
		event.preventDefault();
	},
});