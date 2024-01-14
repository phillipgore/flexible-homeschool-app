import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Redirection if signed out.
function checkSignOut(context, redirect) {
	if (!Meteor.userId()) {
		redirect('/sign-in');
	} else if (!Meteor.user().status.active) {
		redirect('/paused/user');
	}
};

FlowRouter.triggers.enter([checkSignOut], {except: [
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
