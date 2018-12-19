import { Groups } from '../../../api/groups/groups.js';


// Redirection based on a paused subscription.
function checkSubscriptionPaused(context, redirect) {
	if (Groups.findOne().subscriptionStatus === 'paused') {
		redirect('/settings/billing/invoices/2');
	}
};

FlowRouter.triggers.enter([checkSubscriptionPaused], {except: [
	'createAccount',
	'verifySent',
	'verifySuccess',
	'signIn',
	'reset',
	'resetSent',
	'resetPassword',
	'resetSuccess',
	'billingError',
	'billingList', 
	'billingInvoices', 
	'billingEdit',
	'billingCoupons', 
	'supportList',
	'pausedUser'
]});