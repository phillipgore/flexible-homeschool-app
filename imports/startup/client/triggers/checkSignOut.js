// Redirection if signed out.
function checkSignOut(context, redirect) {
	console.log('checkSignOut')
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