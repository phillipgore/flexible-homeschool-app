import { Groups } from '../../api/groups/groups.js';
import { Students } from '../../api/students/students.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
var userData = Meteor.subscribe('userData');
var groupStatus = Meteor.subscribe('groupStatus');
var planningStatusCounts = Meteor.subscribe('planningStatusCounts');

FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && planningStatusCounts.ready() && !FlowRouter._initialized) {
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

function checkSubjectsAvailable(context) {
	let studentsCount = Students.find().count();
	let schoolYearsCount = SchoolYears.find().count();

	if (!studentsCount || !schoolYearsCount) {
		FlowRouter.redirect('/planning/list');
		function count(count) {
			if (count === 0) {
				return 'no';
			}
			return count;
		}
		function label(count, label) {
			if (count === 1) {
				return label;
			}
			return label + 's';
		}
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'fss-info',
			message: 'You currently have ' + count(studentsCount) +' '+ label(studentsCount, 'Student') + ' and ' + count(schoolYearsCount) +' '+ label(schoolYearsCount, 'School Year') + '. You must have at least one of each to work with Subjects.',
		});

	}
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

FlowRouter.triggers.enter([checkSubjectsAvailable], {only: ['subjectsList', 'subjectsNew', 'subjectsView', 'subjectsEdit']});

