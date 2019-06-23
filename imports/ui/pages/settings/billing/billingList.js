import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import moment from 'moment';
import './billingList.html';

Template.billingList.onCreated( function() {
	// Subscriptions
	Session.set('validCoupon', true);
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});

	if (!Session.get('card')) {
		Meteor.call('getCard', function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Session.set('card', result);
			}
		});
	}
});

Template.billingList.onRendered( function() {
	Session.set({
		toolbarType: 'billing',
		labelTwo: 'Billing',
		activeNav: 'settingsList',
	});
});

Template.billingList.helpers({
	subscriptionReady: function() {
		if (Session.get('card') && Template.instance().groupData.ready()) {
			return true;
		}
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
			return 'icn-billing';
		}
		let brand = Session.get('card').brand;		
		if (brand === 'Visa') {
			return 'icn-cc-visa';
		}
		if (brand === 'American Express') {
			return 'icn-cc-amex';
		}
		if (brand === 'MasterCard') {
			return 'icn-cc-master-card';
		}
		if (brand === 'Discover') {
			return 'icn-cc-discover';
		}
		if (brand === 'JCB') {
			return 'icn-cc-jcb';
		}
		if (brand === 'Diners Club') {
			return 'icn-cc-diners';
		}
		if (brand === 'Unknown') {
			return 'icn-billing';
		}
	},

	active: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	accountPausedOrPending: function (subscriptionStatus) {
		if (subscriptionStatus === 'pausePending' || subscriptionStatus === 'paused') {
			return true;
		}
		return false;
	},

	accountPausePending: function (subscriptionStatus) {
		if (subscriptionStatus === 'pausePending') {
			return true;
		}
		return false;
	},

	accountPaused: function (subscriptionStatus) {
		if (subscriptionStatus === 'paused') {
			return true;
		}
		return false;
	},

	monthFormat: function(month) {
		if (!month) {
			return '0' + month;
		}
		return month;
	},
});

Template.billingList.events({
	'click .js-pause-account'(event) {
		event.preventDefault();
		$('.list-item-loading').show();

		let groupId = $('.js-pause-account').attr('id');

		Meteor.call('pauseSubscription', function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
				$('.list-item-loading').hide();
			} else {
				$('.list-item-loading').hide();
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'icn-info',
					message: 'Your account has been paused. You may unpause it at anytime.',
				});
			}
		})
	},

	'click .js-unpause-account'(event) {
		event.preventDefault();
		$('.list-item-loading').show();

		let groupId = $('.js-unpause-account').attr('id');
		function getCouponCode() {
			if ($('#coupon').length) {
				return $('#coupon').val().trim().toLowerCase()
			}
			return '';
		}

		Meteor.call('getCoupon', getCouponCode(), function(error, result) {
			if (error && getCouponCode().length != 0) {
				$('#coupon').addClass('error');
				$('.coupon-errors').text('Invalid Coupon.');
				Session.set('validCoupon', false);
			} else {
				Meteor.call('unpauseSubscription', getCouponCode(), function(error, result) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
						$('.list-item-loading').hide();
					} else {
						$('.list-item-loading').hide();
						Alerts.insert({
							colorClass: 'bg-info',
							iconClass: 'icn-info',
							message: 'Your account has been unpaused. Welcome back.',
						});
					}
				});
			}
		});
	},

	'click .js-paused '(event) {
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'icn-info',
			message: 'Your account is paused. You are not being billed nor do you have acces to your data. You may unpause your account at any time.',
		});
	},

	'keyup #coupon, blur #coupon'(event) {
		let instance = Template.instance();

		if (instance.debounce) {
			Meteor.clearTimeout(instance.debounce);
		}

		instance.debounce = Meteor.setTimeout(function() {
			Meteor.call('getCoupon', event.currentTarget.value.trim().toLowerCase(), function(error, result) {
				if (error && event.currentTarget.value.trim().length != 0) {
					$('#coupon').addClass('error');
					$('.coupon-errors').text('Invalid Coupon.');
					Session.set('validCoupon', false);
				} else {
					$('#coupon').removeClass('error');
					$('.coupon-errors').text('');
					Session.set('validCoupon', true);
				}
			})
		}, 500);
	}
});