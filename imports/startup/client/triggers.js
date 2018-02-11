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

function clearCardData(context) {
	Session.set('card', '');
};

FlowRouter.triggers.enter([checkSignIn], {only: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([checkSignOut, checkPaymentError], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([clearCardData], {except: ['billingList']});




