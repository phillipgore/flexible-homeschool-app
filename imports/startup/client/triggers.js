import { Groups } from '../../api/groups/groups.js';
var userData = Meteor.subscribe('userData');
var groupStatus = Meteor.subscribe('groupStatus');

FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && !FlowRouter._initialized) {
		FlowRouter.initialize()
	}
});

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

function checkRoleUser(context) {
	if (Meteor.user().info.role === 'User') {
		FlowRouter.redirect('/settings/users/restricted');
	}
};

function checkRoleObserver(context) {
	if (Meteor.user().info.role === 'Observer') {
		FlowRouter.redirect('/settings/users/restricted');
	}
};

function checkPaymentError(context) {
	if (Groups.findOne().subscriptionStatus === 'error') {
		FlowRouter.redirect('/settings/users/restricted');
	}
};

function checkSubscriptionPaused(context) {
	if (Groups.findOne().subscriptionStatus === 'paused') {
		FlowRouter.redirect('/settings/billing/list');
	}
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
FlowRouter.triggers.enter([creditCardData], {except: []});

FlowRouter.triggers.enter([checkSubscriptionPaused], {except: [
	'createAccount', 
	'verifySent', 
	'signIn', 
	'reset', 
	'resetSent', 
	'resetPassword', 
	'billingList', 
	'billingInvoices', 
	'billingEdit', 
	'supportList'
]});

FlowRouter.triggers.enter([checkRoleUser], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingError',
	'billingInvoices',
	'billingEdit',
]});

FlowRouter.triggers.enter([checkRoleObserver], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingError',
	'billingInvoices',
	'billingEdit',
	'planningList',
	'studentsList',
	'studentsNew',
	'studentsView',
	'studentsEdit',
	'schoolYearsNew',
	'schoolYearsList',
	'schoolYearsView',
	'schoolYearsEdit',
	'resourcesList',
	'resourcesNew',
	'resourcesView',
	'resourcesEdit',
	'subjectsList',
	'subjectsNew',
	'subjectsView',
	'subjectsEdit',
]});




