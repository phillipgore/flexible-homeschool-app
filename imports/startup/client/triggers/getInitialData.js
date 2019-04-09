import { Groups } from '../../../api/groups/groups.js';
import moment from 'moment';

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

function initialData(context) {
	getInitialData();
};

FlowRouter.triggers.enter([initialData], {except: [
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








