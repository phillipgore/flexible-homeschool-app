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
		toolbarType: 'billing',
	});
});

Template.billingInvoices.helpers({
	dataReady: function() {
		console.log(Session.get('invoices'))
		console.log(Session.get('card'))
		if (Session.get('invoices') || Session.get('card')) {
			return true;
		}
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
















