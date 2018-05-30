import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import moment from 'moment';
import './billingList.html';

Template.billingList.onCreated( function() {
	// Subscriptions
	this.subscribe('group');

	Meteor.call('getCardBrand', function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: error.reason,
			});
		} else {
			Session.set('cardBrand', result);
		}
	});
});

Template.billingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'billing',
		editUrl: '',
		label: 'Billing',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.billingList.helpers({
	dataReady: function() {
		if (Session.get('cardBrand')) {
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

	cardClass: function() {
		if (!Session.get('cardBrand')) {
			return 'fss-billing';
		}
		let brand = Session.get('cardBrand');		
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

	active: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
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
					iconClass: 'fss-danger',
					message: error.reason,
				});
				$('.list-item-loading').hide();
			} else {
				$('.list-item-loading').hide();
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'fss-info',
					message: 'Your account has been paused. You may unpause it at anytime.',
				});
			}
		})
	},

	'click .js-unpause-account'(event) {
		event.preventDefault();
		$('.list-item-loading').show();

		let groupId = $('.js-unpause-account').attr('id');

		Meteor.call('unpauseSubscription', function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
				$('.list-item-loading').hide();
			} else {
				$('.list-item-loading').hide();
				Alerts.insert({
					colorClass: 'bg-info',
					iconClass: 'fss-info',
					message: 'Your account has been unpaused. Welcome back.',
				});
			}
		})
	},

});