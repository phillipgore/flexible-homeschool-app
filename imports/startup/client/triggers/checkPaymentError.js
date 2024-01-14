import { Groups } from '../../../api/groups/groups.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


function checkPaymentError(context, redirect) {
	if (Groups.findOne().subscriptionStatus === 'error' || Groups.findOne().subscriptionStatus === 'freeTrialExpired') {
		redirect('/settings/billing/error/1');
	}
};

FlowRouter.triggers.enter([checkPaymentError], {except: [
	'createAccount',
	'verifySent',
	'verifySuccess',
	'signIn',
	'reset',
	'resetSent',
	'resetPassword',
	'resetSuccess',
	'billingError',
	'pausedUser'
]});