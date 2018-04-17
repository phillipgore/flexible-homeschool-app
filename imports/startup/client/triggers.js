import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
SchoolYearsSubbar = new Mongo.Collection('schoolYearsSubbar');

import moment from 'moment';

let year = moment().year();
let month = moment().month();

function startYear(year) {
	if (month < 6) {
		return year = (year - 1).toString();
	}
	return year.toString();
}

var userData = Meteor.subscribe('userData');
var groupStatus = Meteor.subscribe('groupStatus');
var planningStatusStats = Meteor.subscribe('planningStatusStats');
var allStudents = Meteor.subscribe('allStudents');
var schoolYearsSubbar = Meteor.subscribe('schoolYearsSubbar');
var startYear = startYear(moment().year());

FlowRouter.wait();

Tracker.autorun(() => {
	if (userData.ready() && groupStatus.ready() && planningStatusStats.ready() && allStudents.ready() && schoolYearsSubbar.ready() && !FlowRouter._initialized) {
		FlowRouter.initialize()
	}
});

function schoolYearId(year) {
	if (SchoolYearsSubbar.findOne({startYear: {$gte: startYear}}, {sort: {starYear: 1}})) {
		return SchoolYearsSubbar.findOne({startYear: {$gte: startYear}}, {sort: {starYear: 1}}).schoolYearId;
	}
	return SchoolYearsSubbar.findOne({startYear: {$lte: startYear}}, {sort: {starYear: 1}}).schoolYearId;
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
	if (!Session.get('selectedResourceType')) {
		Session.set('selectedResourceType', 'all');
	}

	if (!Session.get('selectedResourceAvailability')) {
		Session.set('selectedResourceAvailability', 'all');
	}

	if (!Session.get('selectedSchoolYearId')) {
		Session.set('selectedSchoolYearId', schoolYearId(startYear));
	}

	if (!Session.get('selectedStudentId')) {
		Session.set('selectedStudentId', Students.findOne({}, {sort: {birthday: 1, lastName: 1, firstName: 1}})._id);
	}

	if (!Session.get('selectedTermId') && Session.get('selectedSchoolYearId')) {
    	Session.set('selectedTermId', SchoolYearsSubbar.findOne({schoolYearId: Session.get('selectedSchoolYearId')}, {sort: {order: 1,}}).firstTermId);
    }

    if (!Session.get('selectedWeekId') && Session.get('selectedTermId')) {
    	Session.set('selectedWeekId', SchoolYearsSubbar.findOne({schoolYearId: Session.get('selectedSchoolYearId')}, {sort: {order: 1,}}).firstWeekId);
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

