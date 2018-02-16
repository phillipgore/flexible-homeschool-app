import {Template} from 'meteor/templating';
import './billingInvoices.html';

Template.billingInvoices.onCreated( function() {
	// Subscriptions
	Meteor.call('getUpcomingInvoices', function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'fss-danger',
				message: error.reason,
			});
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
});


Template.billingInvoices.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/settings/billing/list',
		leftIcon: 'fss-back',
		label: 'Invoices',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.billingInvoices.helpers({
	dataReady: function() {
		if (Session.get('upcomingInvoices') && Session.get('invoices')) {
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
















