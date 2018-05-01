import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
InitialIds = new Mongo.Collection('initialIds');
InitialPaths = new Mongo.Collection('initialPaths');

import moment from 'moment';

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
let initialIds = Meteor.subscribe('initialIds');
let initialStats = Meteor.subscribe('initialStats');
let initialPaths = Meteor.subscribe('initialPaths');
let startYear = startYearFunction(year);

FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && initialStats.ready() && initialPaths.ready() && initialIds.ready() && !FlowRouter._initialized) {
		FlowRouter.initialize()
	}
});

function schoolYearId(year) {
	if (InitialPaths.findOne({startYear: {$gte: startYear}}, {sort: {starYear: 1}})) {
		return InitialPaths.findOne({startYear: {$gte: startYear}}, {sort: {starYear: 1}}).schoolYearId;
	}
	return InitialPaths.findOne({startYear: {$lte: startYear}}, {sort: {starYear: 1}}).schoolYearId;
};


function checkSignIn(context, redirect) {
	if (Meteor.userId()) {
		redirect('/planning/list');
	}
};

function checkSignOut(context, redirect) {
	if (!Meteor.userId()) {
		redirect('/sign-in');
	}
};

function navbarData(context) {
	if (!Session.get('selectedFramePosition')) {
		Session.set('selectedFramePosition', 1);
	}
	
	if (!Session.get('selectedResourceType')) {
		Session.set('selectedResourceType', 'all');
	}

	if (!Session.get('selectedResourceAvailability')) {
		Session.set('selectedResourceAvailability', 'all');
	}

	if (InitialIds.find().count()) {
		if (!Session.get('selectedStudentId')) {
			Session.set('selectedStudentId', InitialIds.findOne().studentId);
		}

		if (!Session.get('selectedResourceId')) {
			Session.set('selectedResourceId', InitialIds.findOne().resourceId);
	    }
	} else {
			Session.set('selectedStudentId', 'empty');
			Session.get('selectedResourceId', 'empty');
	}

	if (InitialPaths.find().count()) {
		if (!Session.get('selectedSchoolYearId')) {
			Session.set('selectedSchoolYearId', schoolYearId(startYear));
		}

		if (!Session.get('selectedTermId') && Session.get('selectedSchoolYearId')) {
	    	Session.set('selectedTermId', InitialPaths.findOne({schoolYearId: Session.get('selectedSchoolYearId')}).firstTermId);
	    }

	    if (!Session.get('selectedWeekId') && Session.get('selectedTermId')) {
	    	Session.set('selectedWeekId', InitialPaths.findOne({schoolYearId: Session.get('selectedSchoolYearId')}).firstWeekId);
	    }
	} else {
			Session.set('selectedSchoolYearId', 'empty');
	    	Session.set('selectedTermId', 'empty');
	    	Session.set('selectedWeekId', 'empty');
	}
};

function checkRoleUser(context, redirect) {
	if (Meteor.user().info.role === 'User') {
		redirect('/settings/users/restricted');
	}
};

function checkRoleObserver(context, redirect) {
	if (Meteor.user().info.role === 'Observer') {
		redirect('/settings/users/restricted');
	}
};

function checkRoleApplication (context, redirect) {
	if (Meteor.user().info.role === 'Application Administrator' || Meteor.user().info.role === 'Developer') {
		redirect('/settings/list');
	} 
};

function checkPaymentError(context, redirect) {
	if (Groups.findOne().subscriptionStatus === 'error') {
		redirect('/settings/billing/error');
	}
};

function checkSubscriptionPaused(context, redirect) {
	if (Groups.findOne().subscriptionStatus === 'paused') {
		redirect('/settings/billing/list');
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
	let studentsCount = Counts.get('studentCount');
	let schoolYearsCount = Counts.get('schoolYearCount');

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
FlowRouter.triggers.enter([checkSignOut, navbarData, checkPaymentError], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([checkSubjectsAvailable], {only: ['subjectsList', 'subjectsNew', 'subjectsView', 'subjectsEdit']});
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

FlowRouter.triggers.enter([checkRoleApplication], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList', 
	'billingError', 
	'billingInvoices', 
	'billingEdit'
]});

