import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import './trackingList.html';

import _ from 'lodash'

Template.trackingList.onCreated( function() {
	let template = Template.instance();

	this.trackingData = Meteor.subscribe('trackinglistPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'), FlowRouter.getParam('selectedWeekId'));
});

Template.trackingList.onRendered( function() {
	Session.set({
		labelOne: 'Tracking',
		activeNav: 'trackingList',
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'tracking',
		editUrl: '',
		newUrl: '',
	});
});

Template.trackingList.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready();
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	terms: function() {
		return Terms.find({}, {sort: {order: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	yearsProgress: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).yearProgress;
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).yearProgress;
		if (yearProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsProgress: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).termProgress;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).termProgress;
		if (termProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	weeksProgress: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).weekProgress;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).weekProgress;
		if (weekProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	progressStats: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]);
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	}

});









