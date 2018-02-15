import { Groups } from '../../api/groups/groups.js';

FlowRouter.subscriptions = function() {
  this.register('groupStatus', Meteor.subscribe('groupStatus'));
};

function checkSignIn(context) {
	if (Meteor.userId()) {
		FlowRouter.redirect('/planning/list');
	}
};

function checkSignOut(context) {
	if (!Meteor.userId()) {
		FlowRouter.redirect('/sign-in');
	}
};

function checkPaymentError(context) {
	FlowRouter.subsReady('groupStatus', function() {
		if (Groups.findOne().subscriptionStatus === 'error') {
			FlowRouter.redirect('/settings/billing/issues');
		}
	});
};

function checkSubscriptionPaused(context) {
	FlowRouter.subsReady('groupStatus', function() {
		if (Groups.findOne().subscriptionStatus === 'paused') {
			FlowRouter.redirect('/settings/billing/list');
		}
	});
};

function creditCardData(context) {
	Session.set({
		card: '',
		hideCoupon: false,
		cardNumber: 'none',
		cardCvc: 'none',
		cardExpiry: 'none',
		postalCode: 'none',
	});
};

FlowRouter.triggers.enter([checkSignIn], {only: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([checkSignOut, checkPaymentError], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([checkSubscriptionPaused], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword', 'billingList', 'billingInvoices', 'billingEdit', 'supportList']});
FlowRouter.triggers.enter([creditCardData], {except: []});




