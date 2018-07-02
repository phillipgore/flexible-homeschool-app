import {Template} from 'meteor/templating';
import './billingInvoices.html';

Template.billingInvoices.onCreated( function() {
	// Subscriptions
	Meteor.call('getUpcomingInvoices', function(error, result) {
		if (error) {
			Session.set('upcomingInvoices', false);
		} else {
			Session.set('upcomingInvoices', result);
		}
	});

	Meteor.call('getInvoices', function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: error.reason,
			});
		} else {
			Session.set('invoices', result);
		}
	});

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
	});
});


Template.billingInvoices.onRendered( function() {
	Session.set({
		labelThree: 'Invoices',
		activeNav: 'settingsList',
	});
});

Template.billingInvoices.helpers({
	dataReady: function() {
		if (Session.get('upcomingInvoices') && Session.get('invoices') && Session.get('card')) {
			return true;
		}
		if (!Session.get('upcomingInvoices') && Session.get('invoices') && Session.get('card')) {
			return true;
		}
		return false;
	},

	invoices: function() {
		return Session.get('invoices');
	},

	upcomingInvoices: function() {
		return Session.get('upcomingInvoices');
	},

	invoiceStatus: function(attempted, paid) {
		if (!attempted) {
			return 'txt-warning';
		}
		if (paid) {
			return 'txt-success';
		}
		return 'txt-danger';
	}
});
















