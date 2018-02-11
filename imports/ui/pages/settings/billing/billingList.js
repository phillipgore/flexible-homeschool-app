import {Template} from 'meteor/templating';
import './billingList.html';

Template.billingList.onCreated( function() {
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
			console.log(result)
			Session.set('card', result);
		}
	})
});

Template.billingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/settings/list',
		leftIcon: 'fss-back',
		label: 'Billing',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.billingList.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	card: function() {
		return JSON.stringify(Session.get('card'));
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
});