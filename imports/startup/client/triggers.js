import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
InitialIds = new Mongo.Collection('initialIds');
InitialPaths = new Mongo.Collection('initialPaths');

import moment from 'moment';
import _ from 'lodash'

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
let initialIds = Meteor.subscribe('initialIds', startYearFunction(year));
let initialStats = Meteor.subscribe('initialStats');
let initialPaths = Meteor.subscribe('initialPaths');

FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && initialIds.ready() && initialStats.ready() && initialPaths.ready() && !FlowRouter._initialized) {
		FlowRouter.initialize()
	}
});

function checkSignIn(context, redirect) {
	if (Meteor.userId()) {
		redirect('/initializing');
	}
};

function checkSignOut(context, redirect) {
	if (!Meteor.userId()) {
		redirect('/sign-in');
	}
};

function initialData(context) {
	// Initial Frame
	if (!Session.get('selectedFramePosition')) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	}


	// Initial Resources
	if (!Session.get('selectedResourceType')) {
		Session.set('selectedResourceType', 'all');
	}

	if (!Session.get('selectedResourceAvailability')) {
		Session.set('selectedResourceAvailability', 'all');
	}


	// Initial Ids
	let initialIds = InitialIds.findOne()
	Object.keys(initialIds).forEach(function(key) {
		if (key != '_id' && !Session.get('selected' + _.upperFirst(key) + 'Id')) {
			// console.log('selected' + _.upperFirst(key) + 'Id: ' + initialIds[key])
			Session.set('selected' + _.upperFirst(key) + 'Id', initialIds[key]);
		}
	});
	

	// Nav Ids
	if (!Session.get('selectedTermId')) {
		let termId = InitialIds.find().fetch()[0]['term' + Session.get('selectedStudentId') + Session.get('selectedSchoolYearId')];
		if (termId) { 
			Session.set('selectedTermId', termId);
		} else {
			Session.set('selectedTermId', 'empty');
		}
	}

	if (!Session.get('selectedWeekId')) {
		let weekId = InitialIds.find().fetch()[0]['week' + Session.get('selectedStudentId') + Session.get('selectedSchoolYearId') + Session.get('selectedTermId')];
		if (weekId) {
			Session.set('selectedWeekId', weekId);
		} else {
			Session.set('selectedWeekId', 'empty');
		}
	}

	if (!Session.get('selectedResourceId')) {
		Session.set('selectedResourceId', InitialIds.findOne().resourceAllAll)	
	}

	if (!Session.get('selectedSubjectId')) {
		Session.set('selectedSubjectId', InitialIds.find().fetch()[0]['subject' + Session.get('selectedStudentId') + Session.get('selectedSchoolYearId')]);
	}

	// Initial Paths
	if (!Session.get('planningPathName')) {
		Session.set('planningPathName', 'students');
	}

	if (Session.get('selectedStudentId') && Session.get('selectedSchoolYearId') && Session.get('selectedTermId') && Session.get('selectedWeekId')) {
		Session.set('initialized', true);
	}	
};

function checkRoleUser(context, redirect) {
	if (Meteor.user().info.role === 'User') {
		if (_.startsWith(context.route.name, 'users') || _.startsWith(context.route.name, 'billing')) {
			redirect('/settings/support/view');
		}
	}
};

function checkRoleObserver(context, redirect) {
	if (Meteor.user().info.role === 'Observer') {
		if (_.startsWith(context.route.name, 'users') || _.startsWith(context.route.name, 'billing')) {
			redirect('/settings/support/view');
		} else {
			redirect('/settings/users/restricted');
		}
	}
};

function checkRoleApplication (context, redirect) {
	if (Meteor.user().info.role === 'Application Administrator' || Meteor.user().info.role === 'Developer') {
		redirect('/settings/support/view');
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

function resetSessions(context) {
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
FlowRouter.triggers.enter([initialData, checkSignOut, checkPaymentError], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
// FlowRouter.triggers.enter([checkSubjectsAvailable], {only: ['subjectsList', 'subjectsNew', 'subjectsView', 'subjectsEdit']});
FlowRouter.triggers.enter([resetSessions]);

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

