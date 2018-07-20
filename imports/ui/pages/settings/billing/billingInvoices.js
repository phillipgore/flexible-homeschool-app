import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import './billingInvoices.html';

import moment from 'moment';

Template.billingInvoices.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});

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


Template.billingInvoices.onRendered( function() {
	Session.set({
		labelThree: 'Invoices',
		activeNav: 'settingsList',
		toolbarType: 'billing',
	});
});

Template.billingInvoices.helpers({
	dataReady: function() {
		if (Template.instance().groupData.ready() && Session.get('upcomingInvoices') && Session.get('invoices') && Session.get('card') && Session.get('coupon')) {
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
	},

	group: function() {
		return Groups.findOne({});
	},

	coupon: function() {
		return Session.get('coupon');
	},

	couponNotice: function(couponId, createdOn, durationInMonths) {
		if (Groups.find() && Groups.find({stripeCouponCodes: [couponId]})) {
			return false;
		}
		if (moment(createdOn).add(durationInMonths, 'M') > moment()) {
			return true;
		}
		return false;
	}
});
















