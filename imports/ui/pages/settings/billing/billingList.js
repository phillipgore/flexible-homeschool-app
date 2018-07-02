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
	Session.set({
		toolbarType: 'billing',
		labelTwo: 'Billing',
		activeNav: 'settingsList',
	});
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

	active: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},
});