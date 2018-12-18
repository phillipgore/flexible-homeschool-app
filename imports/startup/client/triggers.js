import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';

import moment from 'moment';
import _ from 'lodash'

InitialIds = new Mongo.Collection('initialIds');

let year = moment().year();
let month = moment().month();

function startYearFunction(year) {
	if (month < 6) {
		return year = (year - 1).toString();
	}
	return year.toString();
}

let userData = Meteor.subscribe('userData');
let groupStatus = Meteor.subscribe('groupStatus');
let getInitialIds = Meteor.subscribe('initialIds', startYearFunction(year));
let getInitialStats = Meteor.subscribe('initialStats');



FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && getInitialIds.ready() && getInitialStats.ready() && !FlowRouter._initialized) {
		FlowRouter.initialize()
	}
});

function getInitialData() {
	let initialIds = InitialIds.findOne();
	Session.set('initialIds', initialIds)

	// Initial Frame
	if (!Session.get('selectedFramePosition')) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	}

	// Initial Student
	if (!Session.get('selectedStudentId')) {
		Session.set('selectedStudentId', initialIds.studentId);
	}

	// Initial School Year
	if (!Session.get('selectedSchoolYearId')) {
		Session.set('selectedSchoolYearId', initialIds.schoolYearId);
	}

	// Initial Resources
	if (!Session.get('selectedResourceType')) {
		Session.set('selectedResourceType', 'all');
	}

	if (!Session.get('selectedResourceAvailability')) {
		Session.set('selectedResourceAvailability', 'all');
	}

	if (!Session.get('selectedResourceId')) {
		Session.set('selectedResourceId', initialIds.resourceId);
	}

	if (!Session.get('selectedResourceCurrentTypeId')) {
		Session.set('selectedResourceCurrentTypeId', initialIds.resourceType);
	}

	// Initial Term
	if (!Session.get('selectedTermId')) {
		Session.set('selectedTermId', initialIds.termId);
	}

	if (!Session.get('selectedReportingTermId')) {
		Session.set('selectedReportingTermId', initialIds.termId);
	}

	// Initial Week
	if (!Session.get('selectedWeekId')) {
		Session.set('selectedWeekId', initialIds.weekId);
	}

	if (!Session.get('selectedReportingWeekId')) {
		Session.set('selectedReportingWeekId', initialIds.weekId);
	}

	// Initial School Work
	if (!Session.get('selectedSchoolWorkId')) {
		Session.set('selectedSchoolWorkId', initialIds.schoolWorkId);
	}

	// Initial Report
	if (!Session.get('selectedReportId')) {
		Session.set('selectedReportId', initialIds.reportId);
	}

	// Initial User
	if (!Session.get('selectedUserId')) {
		Session.set('selectedUserId', initialIds.userId);
	}

	// Initial Paths
	if (!Session.get('planningPathName')) {
		Session.set('planningPathName', 'students');
	}	

	// Initial Group
	if (Meteor.user().info.role === 'Application Administrator' && !Session.get('selectedGroupId')) {
		Session.set('selectedGroupId', initialIds.groupId);
	}
};

// Redirection if signed in.
function checkSignIn(context, redirect) {
	if (Meteor.userId()) {
		getInitialData();
		if (Meteor.user().info.role === 'Observer') {
			redirect('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else if (Counts.get('studentCount') + Counts.get('schoolYearCount') + Counts.get('schoolWorkCount')) {
			redirect('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else {
			redirect('/planning/students/view/1/' + Session.get('selectedStudentId'));
		}
	};
};

FlowRouter.triggers.enter([checkSignIn], {only: [
	'createAccount',
	'verifySent',
	'verifySuccess',
	'signIn',
	'reset',
	'resetSent',
	'resetPassword',
	'resetSuccess'
]});



// Retireve initial data.
function initialData(context) {
	getInitialData();
};

// Redirection if signed out.
function checkSignOut(context, redirect) {
	if (!Meteor.userId()) {
		redirect('/sign-in');
	} else if (!Meteor.user().status.active) {
		redirect('/paused/user');
	}
};

// Redirection if payment error.
function checkPaymentError(context, redirect) {
	if (Groups.findOne().subscriptionStatus === 'error') {
		redirect('/settings/billing/error/1');
	}
};

FlowRouter.triggers.enter([checkSignOut, checkPaymentError, initialData], {except: [
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



// Redirect based on user role.
function checkRoleUser(context, redirect) {
	if (Meteor.user().info.role === 'User') {
		if (_.startsWith(context.route.name, 'users') || _.startsWith(context.route.name, 'billing')) {
			redirect('/settings/support/view/1');
		}
	}
};

FlowRouter.triggers.enter([checkRoleUser], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingInvoices',
	'billingEdit',
	'billingCoupons',
]});



// Redirection based on observer role.
function checkRoleObserver(context, redirect) {
	if (Meteor.user().info.role === 'Observer') {
		if (_.startsWith(context.route.name, 'users') || _.startsWith(context.route.name, 'billing')) {
			redirect('/settings/support/view/1');
		} else {
			redirect('/settings/users/restricted/2');
		}
	}
};

FlowRouter.triggers.enter([checkRoleObserver], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingInvoices',
	'billingEdit',
	'billingCoupons',
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
	'schoolWorkList',
	'schoolWorkNew',
	'schoolWorkView',
	'schoolWorkEdit',
]});



// Redirection based on App Admin or Dev role.
function checkRoleAppAdminOrDev (context, redirect) {
	if (Meteor.user().info.role === 'Application Administrator' || Meteor.user().info.role === 'Developer') {
		redirect('/settings/support/view/1');
	} 
};

FlowRouter.triggers.enter([checkRoleAppAdminOrDev], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingInvoices', 
	'billingEdit',
	'billingCoupons',
]});



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



// CC infor reset.
function resetSessions(context) {
	Session.set({
		card: '',
		hideCoupon: false,
		cardNumber: 'none',
		cardCvc: 'none',
		cardExpiry: 'none',
		postalCode: 'none',
		coupon: ''
	});
};

FlowRouter.triggers.enter([resetSessions], {except: [
	'usersView',
	'usersNew',
	'usersVerifyResent',
	'usersEdit',
	'usersRestricted',
	'billingError',
	'billingInvoices',
	'billingEdit',
	'billingCoupons',
	'supportView',
	'usersView',
]});



// Set frame position.
function setFramePosition(context) {
	let currentPostion = context.params.selectedFramePosition;

	if (!currentPostion || currentPostion === '1') {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');		
	} else if (currentPostion === '2') {
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');		
	} else if (currentPostion === '3') {
		Session.setPersistent('selectedFramePosition', 3);
		Session.setPersistent('selectedFrameClass', 'frame-position-three');		
	} 
};

// Clear Alerts.
function clearAlerts(context) {
	Alerts.remove({});
};

// Reset scroll position.
function scrollReset(context) {
	$(window).scrollTop(0);
};

FlowRouter.triggers.enter([setFramePosition, clearAlerts, scrollReset]);



// Redirection based on App Admin role.
function isAppAdmin(context) {
	if (Meteor.user().info.role != 'Application Administrator') {
		FlowRouter.go('/')
	}
}

FlowRouter.triggers.enter([isAppAdmin], {only: [
	'officeDashboard',
	'officeAccountsList',
	'officeAccountView'
]});










