import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import Stripe from '../../../../modules/stripe';
import './billingCoupons.html';

import moment from 'moment';

Template.billingCoupons.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});

	Meteor.call('getCoupon', Meteor.settings.public.stripeKeepGoingDiscount, function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: error.reason,
			});
		} else {
			Session.set('coupon', result);
		}
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

			let stripeSubscriptionId = template.find("[name='stripeSubscriptionId']").value.trim();
			let stripeCouponCode = template.find("[name='coupon']").value.trim().toLowerCase();

			Meteor.call('applyCoupon', stripeSubscriptionId, stripeCouponCode, function(error, result) {
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
						message: 'Coupon Code "' +stripeCouponCode+ '" has been applied to your account.',
					});
				}
			});

			return false;
		}
	});
});

Template.billingCoupons.helpers({
	dataReady: function() {
		if (Template.instance().groupData.ready() && Session.get('coupon')) {
			return true;
		}
	},

	group: function() {
		return Groups.findOne({});
	},

	coupon: function() {
		return Session.get('coupon');
	},

	couponNotice: function(couponId, createdOn, durationInMonths) {
		if (Groups.find({stripeCouponCodes: [couponId]})) {
			return false;
		}
		if (moment(createdOn).add(durationInMonths, 'M') > moment()) {
			return true;
		}
		return false;
	}
});

Template.billingCoupons.events({
	'submit .js-form-apply-coupon-code'(event) {
		event.preventDefault();
	},
});